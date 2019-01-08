import React from 'react';
import Apply from 'containers/apply';
import WatchPolicy from 'containers/watchPolicy';
import Contact from 'components/contact';

const MainContent = () => (
  <section id="main-content" className="clearfix">
    <Apply />
    <WatchPolicy />
    <Contact />
  </section>
);

export default MainContent;
