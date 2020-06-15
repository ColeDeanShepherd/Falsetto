import { History, UnregisterCallback } from "history";
import * as React from "react";
import * as QueryString from "query-string";

import { flattenArrays } from '../../lib/Core/ArrayUtils';
import { DependencyInjector } from "../../DependencyInjector";

import { AppModel } from "../../App/Model";

import { LimitedWidthContentContainer } from "../../ui/Utils/LimitedWidthContentContainer";

import { Card } from "../../ui/Card/Card";
import { Button } from "../../ui/Button/Button";

import "./Stylesheet.css"; // TODO: use a CSS preprocessor and split this into multiple files

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
  public constructor(public name: string, public slides: Array<Slide>) {}
}

export interface ISlideshowProps {
  slideGroups: Array<SlideGroup>;
}

export interface ISlideshowState {
  slideIndex: number;
}

export class Slideshow extends React.Component<ISlideshowProps, ISlideshowState> {
  public constructor(props: ISlideshowProps) {
    super(props);
    
    this.history = DependencyInjector.instance.getRequiredService<History<any>>("History");

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
    
    this.historyUnregisterCallback = this.history.listen((location, action) => {
      this.setState({
        slideIndex: this.getSlideIndexFromUriParams(slides, location.search)
      });
    });

    this.registerKeyEventHandlers();
  }

  public componentWillUnmount() {
    AppModel.instance.pianoAudio.releaseAllKeys();

    this.unregisterKeyEventHandlers();

    if (this.historyUnregisterCallback) {
      this.historyUnregisterCallback();
      this.historyUnregisterCallback = undefined;
    }
  }

  // TODO: show slide group
  public render(): JSX.Element {
    const { slides } = this;
    const { slideIndex } = this.state;

    const renderedSlide = slides[slideIndex].renderFn(this);

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
            {false ? this.renderSlideLocation() : null}
            <LimitedWidthContentContainer style={{ flexGrow: 1 }}>
              <Card style={{ height: "100%" }}>
                {renderedSlide}
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

  private slides: Array<Slide>;

  private getStateFromProps(props: ISlideshowProps): [ISlideshowState, Array<Slide>] {
    const slides = flattenArrays<Slide>(props.slideGroups.map(sg => sg.slides));

    const state = {
      slideIndex: this.getSlideIndexFromUriParams(slides, this.history.location.search)
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
  
  private history: History<any>;
  private historyUnregisterCallback: UnregisterCallback | undefined;

  // #endregion React Functions

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

    this.setState({ slideIndex: slideIndex }, () => {
      const oldSearchParams = QueryString.parse(this.history.location.search);
      const newSearchParams = { ...oldSearchParams, slide: slides[slideIndex].url };

      this.history.push({
        pathname: this.history.location.pathname,
        search: `?${QueryString.stringify(newSearchParams)}`
      });
    });
  }

  // #endregion Actions

  private getSlideIndexFromUriParams(slides: Array<Slide>, search: string): number {
    const urlSearchParams = QueryString.parse(search);
    if (!(urlSearchParams.slide && (typeof urlSearchParams.slide === 'string'))) { return 0; }

    const slideIndex = slides.findIndex(s => s.url === urlSearchParams.slide);
    return Math.max(slideIndex, 0);
  }
}