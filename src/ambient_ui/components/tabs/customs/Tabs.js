import { withStyles } from '@material-ui/core/styles';
import MuiTabs from '@material-ui/core/Tabs';

export default withStyles({
	flexContainer: {
		alignItems: 'flex-end',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
	},
	indicator: {
		backgroundColor: 'transparent',
	},
})(MuiTabs);