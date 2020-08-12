import React, { Component } from "react";
import "./Collage.css";
import { Image } from "./Image";

interface Props {
  titleVisible: boolean;
  images: Image[];
}

export class Collage extends Component<Props> {
  render() {
    return (
      <div className="collage-container">
        {this.props.images.map((img) => (
          <Image image={img} showTitle={this.props.titleVisible} />
        ))}
      </div>
    );
  }
}
