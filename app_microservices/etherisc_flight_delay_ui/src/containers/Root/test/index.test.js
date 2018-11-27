import React from 'react';
import { shallow } from 'enzyme';
import App from '../index';
import CardForm from '../cardForm';


describe('<App/>', () => {
  it('should contain card form', () => {
    const renderedComponent = shallow(<App />);
    expect(renderedComponent.find(CardForm).length).toBe(1);
  });
});
