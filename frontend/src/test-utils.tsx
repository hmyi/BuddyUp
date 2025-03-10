import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: RouterWrapper, ...options });

export { customRender as render };