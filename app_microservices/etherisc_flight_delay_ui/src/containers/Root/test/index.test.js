import React from 'react';
import { shallow } from 'enzyme';
import { TextInputField } from 'evergreen-ui';
import App from '../index';


describe('<App/>', () => {
  it('should have 6 input fields', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.find(TextInputField).length).toBe(6);
  });
});
