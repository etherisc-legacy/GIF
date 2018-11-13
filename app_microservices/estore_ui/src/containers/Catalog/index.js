import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';
import numeral from 'numeral';


import products from 'products.json';


const Article = styled.article`
  margin: 0 auto;
  width: 900px;
  padding: 100px 20px 20px 20px;
`;

const List = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Product = styled.div`
  width: 30%;
  background: #fff; 
  border: 1px solid #e3e7ea;
  text-align: center;
  padding: 20px 0 20px 0;
  
  img {
    margin: 15px 0;
  }
`;

const BuyBtn = styled.div`
  margin: 10px 0;
  
  a {
    background: #29a06b;
    display: block;
    padding: 10px;
    text-decoration: none;
    font-weight: bold;
    color: #fff;
    margin: 20px 20px 0;
    
    :hover {
      background: ${darken('0.03', '#29a06b')}
    }
  }
`;

/**
 * Catalog page
 * @return {*}
 * @constructor
 */
const Catalog = () => {
  const items = products.map(item => (
    <Product key={item.vendorCode}>
      <h3>{item.product}</h3>
      <img src={item.image} width="200" alt={item.product} />

      <div>Price: <b>{numeral(item.price).format('0,0.00')}</b> {item.currency}</div>

      <BuyBtn>
        <Link to={`/checkout/${item.vendorCode}`}>Buy</Link>
      </BuyBtn>
    </Product>
  ));

  return (
    <Article>
      <Helmet>
        <title>Catalog</title>
      </Helmet>

      <h1>Catalog</h1>

      <List>
        {items}
      </List>
    </Article>
  );
};

export default Catalog;
