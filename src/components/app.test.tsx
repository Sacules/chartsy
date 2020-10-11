import React from 'react';
import { shallow } from 'enzyme';
import App from './app';

describe('<App />', () => {
    it('Component successfully renders', () => {
        const wrapper = shallow(<App />);
        const appWrapper = wrapper.find(`[data-test='app']`);
        expect(appWrapper).toHaveLength(1);
    });
});
