import * as React from "react";
import { Vector2D } from '../lib/Core/Vector2D';
import { PI } from '../lib/Core/MathUtils';

export interface ICircleProgressBarProps {
  width: number;
  progress: number;
  style?: any;
}
export const CircleProgressBar: React.FunctionComponent<ICircleProgressBarProps> = (props: ICircleProgressBarProps) => {
  const arcCenter = new Vector2D(props.width / 2, props.width / 2);

  const arcWidth = 4;
  const arcDiameter = props.width - arcWidth;
  const arcRadius = arcDiameter / 2;
  const circleCircumference = (PI * arcDiameter);
  const arcLength = props.progress * circleCircumference;
  const arcStyle: any = {
    strokeDasharray: `${circleCircumference} ${circleCircumference}`,
    strokeDashoffset: circleCircumference - arcLength
  };
  
  const fontSize = 16;
  const textStyle: any = {
    textAnchor: "middle"
  };

  return (
    <svg
      width={props.width} height={props.width}
      viewBox={`0 0 ${props.width} ${props.width}`}
      version="1.1" xmlns="http://www.w3.org/2000/svg"
      style={props.style}>
      <text x={props.width / 2} y={(props.width / 2) + (0.35 * fontSize)} style={textStyle}>{Math.round(100 * props.progress)}%</text>
      <circle cx={arcCenter.x} cy={arcCenter.y} r={arcRadius} stroke="lightgray" strokeWidth={arcWidth} fill="none" />
      <circle cx={arcCenter.x} cy={arcCenter.y} r={arcRadius} transform={`rotate(90 ${arcCenter.x} ${arcCenter.y})`} stroke="green" strokeWidth={arcWidth} fill="none" style={arcStyle} />
    </svg>
  );
}