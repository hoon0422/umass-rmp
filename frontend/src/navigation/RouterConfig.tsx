import {
  AuthPageContainer,
  HomePageContainer,
  SectionPageContainer,
} from '@pages';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AUTH_PATH, HOME_PATH, NOT_FOUND_PATH, SECTION_PATH } from '.';

export const RouterConfig = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={HOME_PATH} component={HomePageContainer} />
      <Route exact path={AUTH_PATH} component={AuthPageContainer} />
      <Route exact path={SECTION_PATH} component={SectionPageContainer} />
      <Route exact path={NOT_FOUND_PATH} />
      <Redirect path="*" to={NOT_FOUND_PATH} />
    </Switch>
  </BrowserRouter>
);
