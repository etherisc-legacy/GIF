import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { Link } from 'react-router-dom';


const Wrapper = styled.div`
  position: fixed;
  width: 70%;
  background: #ffffff;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.12);
  display: flex;
  justify-content: space-between;
  padding: 20px;
  z-index: 2;
`;

const Logotype = styled.div`
  font-weight: bold;
  text-transform: uppercase;
`;

const Nav = styled.div`
  a {
    background: #f4f5f6;
    font-weight: bold;
    color: #455262;
    text-decoration: none;
    padding: 10px 15px;
    margin-left: 10px;
    font-size: 14px;
    
    :hover {
      background: ${darken('0.03', '#f4f5f6')}
    }
  }
  
  a.admin {
    background: #feb2b3;
    
    :hover {
      background: ${darken('0.03', '#feb2b3')}
    }
  }
`;

/**
 * Application header
 * @return {*}
 * @constructor
 */
const Header = () => (
  <Wrapper>
    <Logotype>Electronic store</Logotype>
    <Nav>
      <Link to="/">Catalog</Link>
      <Link to="/claim">Claim</Link>
      <Link className="admin" to="/dashboard">Admin dashboard</Link>
    </Nav>
  </Wrapper>
);

export default Header;
