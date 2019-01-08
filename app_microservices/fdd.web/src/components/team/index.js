import React, { Component } from 'react';
import Article from 'shared/components/article';
import ChristophPhoto from 'assets/images/portraet_cm.png';
import StephanPhoto from 'assets/images/portraet_sk.png';
import Person from './person';


export default class Team extends Component {
  state

  render() {
    return (
      <Article id="fdi_team" title="Meet the team">
        <section className="feature-columns row clearfix">

          <Person
            name="Christoph Mussenbrock"
            photo={ChristophPhoto}
          >
            <p>
              Christoph has a long record of accomplishment in the cooperative
              banking sector in Germany.
            </p>
            <p>
              After several years on the board of a cooperative bank, he switched
              to the IT segment and became Chief Program Manager Credit Solutions
              and Chief of Strategy Development at Fiducia &amp; GAD IT AG – one
              of Germany’s biggest IT Service Providers. Since 2015, he has been CEO
              of parcIT GmbH, one of Germany’s best-known companies specialized in
              risk management solutions.
            </p>
            <p>
              Due to his many years of working in the field of banking and insurance,
              Christoph is highly experienced in all matters concerning regulatory
              frameworks. He also co-founded Progeno Wohnungsgenossenschaft eG, a
              housing cooperative in Munich, which has successfully crowdfunded a
              large residential project in Munich.
            </p>
            <p>
              Christoph has a master’s degree in mathematics and wrote his thesis on
              formal soft- and hardware verification.
            </p>
          </Person>

          <Person
            name="Stephan Karpischek"
            photo={StephanPhoto}
          >
            <p>Stephan is digital strategist at <a href="http://disrupt-consulting.com/">disrupt consulting</a> and has more than 20 years experience in IT businesses. He advises finance and telecom enterprises on digital strategy. In 2015 he was part of the of the UBS crypto 2.0 innovation lab at Level39 in London. Stephan has been working on digital currencies since 2008 and likes to play with blockchains.</p>
          </Person>

        </section>
      </Article>
    );
  }
}
