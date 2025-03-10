const React = require('react');

const useParams = () => ({ id: '1' });
const useLocation = () => ({ pathname: '/', state: {} });
const useNavigate = () => jest.fn();
const MemoryRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => element;
const Link = ({ children, ...props }) => React.createElement('a', props, children);

module.exports = {
  useParams,
  useLocation,
  useNavigate,
  MemoryRouter,
  Routes,
  Route,
  Link,
};
