
const React = require('react');

const useLocation = () => ({ pathname: '/' });
const useNavigate = () => jest.fn();
const MemoryRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element;
const Link = ({ children, ...props }) => React.createElement('a', props, children);

module.exports = {
  useLocation,
  useNavigate,
  MemoryRouter,
  Routes,
  Route,
  Link,
};
