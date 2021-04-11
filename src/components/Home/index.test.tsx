import React from 'react';
import { shallow } from 'enzyme';
import { Home } from './home';

describe('<Home />', () => {
    it('Component successfully renders', () => {
        const wrapper = shallow(<Home />);
        const homeWrapper = wrapper.find(`[data-test='homeComponent']`);
        expect(homeWrapper).toHaveLength(1);
    });
});