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
    distance: PropTypes.number,
    easing: PropTypes.func,
    start: PropTypes.number,
    offset: PropTypes.number
  };

  static defaultProps = {
    easing: t => t,
    offset: 0
  };

  state = {
    elementHeight: 0,
    elementTop: 0,
    progress: 0
  };

  setProgress = () => {
    const { state, props } = this;
    const scrollPos = scrollingElement.scrollTop;
    const startPos = props.start || state.elementTop;
    const distance = props.distance || state.elementHeight;
    const progress = (scrollPos - startPos - props.offset) / distance;

    // Often progress will be stuck at something like 0.999999. This ensures that progress is rounded up to 1 when transition is complete.
    if (progress > 1 && this.state.progress !== 1) {
      this.setState({ progress: 1 });
      return;
    }

    // Only set state when in transition range, to avoid calling setState excessively
    if (progress >= 0 && progress <= 1) {
      this.setState({ progress: this.props.easing(clamp(progress, 0, 1)) });
    }
  };

  measureElement = callback => {
    const node = ReactDOM.findDOMNode(this);

    if (!node) return;

    const top = node.getBoundingClientRect().top;
    const elementTop = top + scrollingElement.scrollTop - window.innerHeight;
    const elementHeight = node.offsetHeight;

    this.setState({ elementHeight, elementTop }, callback);
  };

  onScroll = () => {
    this.setProgress();
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
