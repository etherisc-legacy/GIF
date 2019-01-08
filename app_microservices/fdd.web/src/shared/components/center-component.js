import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';

/**
 * This is a higher order component decorator
 *
 * It listens for when its children are mounted, then it measures the size of
 * these children on the dom. Then it updates the children with appropriate
 * top and left offsets.
 *
 * Components that are wrapped with this decorator recieve two properties
 * topOffset and leftOffset, they are null before the component has mounted.
 *
 * When the window is resized, this component will reupdate its children. This process
 * is debounced by 100ms to reduce CPU strain
 */
export default function centerComponent(Component) {
  const componentClassName = Component.displayName || Component.name || 'Component';

  class DecoratedComponent extends React.Component {
    static displayName = `Centered(${componentClassName})`

    state = {
      topOffset: null,
      leftOffset: null,
    }

    componentDidMount() {
      this.resizeChildNode();
      this._debouncedResize = debounce(this.resizeChildNode, 100);
      window.addEventListener('resize', this._debouncedResize);
    }

    componentDidUpdate(prevProps) {
      if (this.props.children !== prevProps.children) {
        // Children are different, resize
        this.resizeChildNode();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this._debouncedResize);
    }

    resizeChildNode = () => {
      const node = ReactDOM.findDOMNode(this.refs.component);

      const nodeSize = {
        height: node.clientHeight,
        width: node.clientWidth,
      };

      const windowSize = {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth,
      };

      this.setState({
        topOffset: (windowSize.height - nodeSize.height) / 2,
        leftOffset: (windowSize.width - nodeSize.width) / 2,
      });


    }

    render() {
      const {
        props: {
          ...rest
        },
        state: {
          topOffset,
          leftOffset,
        },
      } = this;

      return (<Component
        {...rest}
        ref="component"
        topOffset={topOffset}
        top={topOffset}
        leftOffset={leftOffset}
        left={leftOffset}
        recenter={this.resizeChildNode}
      />);
    }
  }

  return DecoratedComponent;
}
