import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const scrollingElement =
  typeof window !== "undefined" && window.document
    ? document.scrollingElement || document.documentElement || document.body
    : undefined;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

class ScrollTransition extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    distance: PropTypes.func,
    easing: PropTypes.func,
    start: PropTypes.func,
    onExit: PropTypes.bool,
    offset: PropTypes.number
  };

  static defaultProps = {
    distance: (height, windowH) => height + windowH,
    easing: t => t,
    offset: 0,
    start: (top, height, windowH) => top - windowH
  };

  state = {
    elementHeight: 0,
    elementTop: 0,
    progress: 0
  };

  setProgress = () => {
    const { elementHeight, elementTop } = this.state;
    const windowH = window.innerHeight;
    const scrollPos = scrollingElement.scrollTop;
    const startPos = this.props.start(elementTop, elementHeight, windowH);
    const distance = this.props.distance(this.state.elementHeight, windowH);

    const exitOffset = this.props.onExit ? windowH : 0;
    const progress =
      (scrollPos - startPos - this.props.offset - exitOffset) / distance;

    // Only set state when in transition range, to avoid calling setState excessively
    if (clamp(progress, 0, 1) !== this.state.progress) {
      this.setState({ progress: this.props.easing(clamp(progress, 0, 1)) });
    }
  };

  measureElement = (callback = () => {}) => {
    const node = ReactDOM.findDOMNode(this);

    if (!node) return;

    const top = node.getBoundingClientRect().top;
    const elementTop = top + scrollingElement.scrollTop;
    const elementHeight = node.offsetHeight;

    if (
      elementTop !== this.state.elementTop ||
      elementHeight !== this.state.elementHeight
    ) {
      this.setState({ elementHeight, elementTop }, callback);
    } else {
      callback();
    }
  };

  onScroll = () => {
    this.measureElement(() => {
      this.setProgress();
    });
  };

  onResize = () => {
    this.measureElement();
  };

  componentDidMount() {
    this.measureElement(() => {
      this.setProgress();
    });
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
  }

  render() {
    return this.props.children(this.state.progress);
  }
}

export default ScrollTransition;
