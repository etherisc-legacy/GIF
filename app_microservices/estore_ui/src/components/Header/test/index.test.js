import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Header from '../index';


describe('<App/>', () => {
  it('should have 3 links', () => {
    const renderedComponent = shallow(<Header />);
    expect(renderedComponent.find(Link).length).toBe(3);
  });
});
