import * as  homeActions from './home';
import * as deviceActions from './device';
import * as globalActions from './global';

export default {...homeActions, ...deviceActions, ...globalActions};
