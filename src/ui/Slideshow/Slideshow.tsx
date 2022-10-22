import { History } from "history";
import * as React from "react";

import { flattenArrays } from '../../lib/Core/ArrayUtils';
import { DependencyInjector } from "../../DependencyInjector";

import { AppModel } from "../../App/Model";

import { LimitedWidthContentContainer } from "../../ui/Utils/LimitedWidthContentContainer";

import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files
import { ActionBus } from '../../ActionBus';
import { NavigateAction } from '../../App/Actions';
import { unwrapValueOrUndefined } from '../../lib/Core/Utils';

function getSlideGroup(slideGroups: Array<SlideGroup>, slideIndex: number): [SlideGroup, number] | undefined {
  let numSlidesSeen = 0;

  for (let slideGroupIndex = 0; slideGroupIndex < slideGroups.length; slideGroupIndex++) {
    const slideGroup = slideGroups[slideGroupIndex];
    const newNumSlidesSeen = numSlidesSeen + slideGroup.slides.length;

    if (newNumSlidesSeen > slideIndex) {
      return [slideGroup, slideIndex - numSlidesSeen];
    } else {
      numSlidesSeen = newNumSlidesSeen;
    }
  }

  return undefined;
}

export class Slide {
  public constructor(
    public url: string,
    public renderFn: (slideshow: Slideshow) => JSX.Element
  ) {}
}

export class SlideGroup {
  public constructor(
    public name: string,
    public url: string,
    public slides: Array<Slide>,
    public isPremium: boolean = false) {}
}

export interface ISlideshowProps {
  slideGroups: Array<SlideGroup>;
  currentSlidePath: string;
  premiumProductId?: number;
}

export interface ISlideshowState {
  slideIndex: number;
}

export class Slideshow extends React.Component<ISlideshowProps, ISlideshowState> {
  public constructor(props: ISlideshowProps) {
    super(props);
    
    this.history = DependencyInjector.instance.getRequiredService<History>("History");

    [this.state, this.slides] = this.getStateFromProps(props);
  }

  public tryToMoveToNextSlide() {
    if (!this.canMoveToNextSlide()) { return; }

    this.moveToNextSlideInternal();
  }
  
  public tryToMoveToPreviousSlide() {
    if (!this.canMoveToPreviousSlide()) { return; }

    this.moveToPreviousSlideInternal();
  }

  public getSlideIndex(): number {
    return this.state.slideIndex;
  }

  // #region React Functions
  
  public componentDidMount() {
    const { slides } = this;

    AppModel.instance.pianoAudio.preloadSounds();

    this.registerKeyEventHandlers();
  }

  public componentWillUnmount() {
    AppModel.instance.pianoAudio.releaseAllKeys();

    this.unregisterKeyEventHandlers();
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slides } = this;
    const { slideGroups, premiumProductId } = this.props;
    const { slideIndex } = this.state;

    const slide = slides[slideIndex];
    
    const slideGroupInfo = getSlideGroup(slideGroups, slideIndex);
    if (!slideGroupInfo) {
      return <span style={{ padding: "0 1em" }}>Understanding the Piano Keyboard - Falsetto</span>;
    }

    const slideGroup = slideGroupInfo[0];
    
    // const isSlideDisabledByPaywall = slideGroup.isPremium &&
    //   ((userProfile === undefined) || !userProfile.boughtProductIds.some(pi => pi === premiumProductId));
    const isSlideDisabledByPaywall = false;

    return (
      <div className="slideshow" style={{ height: "100%" }}>
        <div style={{ display: "flex", height: "100%", padding: "0 1em" }}>
          <div>
            <Button
              onClick={_ => this.moveToPreviousSlideInternal()}
              className="slide-nav"
              style={{ visibility: this.canMoveToPreviousSlide() ? "visible" : "hidden", padding: 0 }}
            >
              <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_left</i>
            </Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", textAlign: "center", flexGrow: 1, height: "100%" }}>
            <LimitedWidthContentContainer style={{ flexGrow: 1 }}>
              <Card style={{ height: "100%", position: "relative" }}>
                {slide.renderFn(this)}
              </Card>
            </LimitedWidthContentContainer>
          </div>

          <div>
            <Button
              onClick={_ => this.moveToNextSlideInternal()}
              className="slide-nav"
              style={{ visibility: this.canMoveToNextSlide() ? "visible" : "hidden", padding: 0 }}
            >
              <i className="material-icons" style={{ fontSize: "4em" }}>keyboard_arrow_right</i>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // #endregion React Functions

  private slides: Array<Slide>;

  private getStateFromProps(props: ISlideshowProps): [ISlideshowState, Array<Slide>] {
    const slides = flattenArrays<Slide>(props.slideGroups.map(sg => sg.slides));

    const state = {
      slideIndex: this.getSlideIndexFromSlidePath(slides, props.currentSlidePath)
    } as ISlideshowState;

    return [state, slides];
  }

  private renderSlideLocation(): JSX.Element {
    const { slideGroups } = this.props;
    const { slideIndex } = this.state;

    const slideGroupInfo = getSlideGroup(slideGroups, slideIndex);
    if (!slideGroupInfo) {
      return <span style={{ padding: "0 1em" }}>Understanding the Piano Keyboard - Falsetto</span>;
    }

    const slideGroup = slideGroupInfo[0];
    const indexOfSlideInGroup = slideGroupInfo[1];
    const slideNumberInGroup = 1 + indexOfSlideInGroup;

    return (
      <p style={{ textDecoration: "underline", textAlign: "center" }}>{slideGroup.name} - Slide {slideNumberInGroup} / {slideGroup.slides.length}</p>
    );
  }
  
  private history: History;

  // #region Event Handlers

  private boundOnKeyDown: ((event: KeyboardEvent) => void) | undefined;
  private boundOnKeyUp: ((event: KeyboardEvent) => void) | undefined;

  private registerKeyEventHandlers() {
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    window.addEventListener("keydown", this.boundOnKeyDown);
    
    this.boundOnKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }

  private unregisterKeyEventHandlers() {
    if (this.boundOnKeyDown) {
      window.removeEventListener("keydown", this.boundOnKeyDown);
      this.boundOnKeyDown = undefined;
    }

    if (this.boundOnKeyUp) {
      window.removeEventListener("keyup", this.boundOnKeyUp);
      this.boundOnKeyUp = undefined;
    }
  }

  // TODO: data-based bindings
  private onKeyDown(event: KeyboardEvent) {
    if (event.type === "keydown") {
      // ArrowLeft
      if (event.keyCode === 37) {
        this.moveToPreviousSlideInternal();
      }
      // ArrowRight
      else if (event.keyCode === 39) {
        this.moveToNextSlideInternal();
      }
    }
  }

  private onKeyUp(event: KeyboardEvent) {}

  // #endregion 

  // #region Actions

  private canMoveToNextSlide(): boolean {
    const { slides } = this;
    const { slideIndex } = this.state;

    return (slideIndex + 1) < slides.length;
  }

  private moveToNextSlideInternal() {
    const { slides } = this;
    const { slideIndex } = this.state;

    const newSlideIndex = slideIndex + 1;
    if (newSlideIndex == slides.length) { return; }

    this.moveToSlide(newSlideIndex);
  }

  private canMoveToPreviousSlide(): boolean {
    const { slideIndex } = this.state;
    return slideIndex > 0;
  }

  private moveToPreviousSlideInternal() {
    const { slideIndex } = this.state;

    if (slideIndex === 0) { return; }

    this.moveToSlide(slideIndex - 1);
  }

  private moveToSlide(slideIndex: number) {
    const { slides } = this;
    const { slideGroups, currentSlidePath } = this.props;

    this.setState({ slideIndex: slideIndex }, () => {
      const [slideGroup, _] = unwrapValueOrUndefined(getSlideGroup(slideGroups, slideIndex));
      
      const newUri = this.getCurrentUriWithoutSlidePath(currentSlidePath) + ((slideGroup.url.length > 0) ? (slideGroup.url + '/') : "") + slides[slideIndex].url;

      ActionBus.instance.dispatch(new NavigateAction(newUri));
    });
  }

  // #endregion Actions

  private getSlideIndexFromSlidePath(slides: Array<Slide>, slidePath: string): number {
    const { slideGroups } = this.props;

    const slidePathParts = slidePath.split('/');

    function getSlideGroup(): SlideGroup {
      if (slidePathParts.length >= 1) {
        const slideGroupUri = slidePathParts[0];
        const slideGroup = slideGroups.find(g => g.url === slideGroupUri);

        if (slideGroup !== undefined) { return slideGroup; }
      }

      return slideGroups[0];
    }

    const slideGroup = getSlideGroup();

    function getSlide(): Slide {
      if (slidePathParts.length >= 2) {
        const slideUri = slidePathParts[1];
        const slide = slideGroup.slides.find(s => s.url === slideUri);

        if (slide !== undefined) { return slide; }
      }

      return slideGroup.slides[0];
    }

    const slide = getSlide();
    
    const slideIndex = slides.indexOf(slide);
    return Math.max(slideIndex, 0);
  }

  private getCurrentUriWithoutSlidePath(slidePath: string): string {
    const slidePathStartIndex = this.history.location.pathname.lastIndexOf(slidePath);

    let uriWithoutSlidePath = (slidePathStartIndex >= 0)
      ? this.history.location.pathname.substring(0, slidePathStartIndex)
      : this.history.location.pathname;

    if (uriWithoutSlidePath[uriWithoutSlidePath.length - 1] !== '/') {
      uriWithoutSlidePath += '/';
    }

    return uriWithoutSlidePath;
  }
}