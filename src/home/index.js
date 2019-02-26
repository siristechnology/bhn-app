import React from 'react';
import { FlatList, RefreshControl, AppState } from 'react-native';
import { QueryRenderer, graphql } from 'react-relay';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import Analytics from 'appcenter-analytics'
import ArticleCard from './components/article-card';
import SplashScreen from './components/splash-screen';
import OfflineNotice from './components/offline-notification';
import environment from '../environment';
import actionCreators from './ducks/actions'

class Home extends React.PureComponent {
	constructor (props) {
		super(props);
		this.state = {
			isUpdated: false,
			appState: AppState.currentState
		};
	}

	componentDidMount () {
		Analytics.trackEvent('Home page load');
		AppState.addEventListener('change', this._handleAppStateChange.bind(this));
	}

	componentDidUpdate () {
		Analytics.trackEvent('Home page refresh');
	}

	componentWillUnmount () {
		AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
	}

	_handleAppStateChange (nextAppState) {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log('App has come to the foreground!')
			this.handleRefresh()
		}
		this.setState({ appState: nextAppState });
	}

	handleRefresh () {
		Analytics.trackEvent('Pull down refresh');
		this.setState({ isUpdated: !this.state.isUpdated });
	}

	render () {
		return (
			<QueryRenderer
				environment={environment}
				variables={{ isUpdated: this.state.isUpdated }}
				query={graphql`
					query homeQuery{
							getArticles{
								_id
								title
								shortDescription
								content
								link
								imageLink
								publishedDate
								modifiedDate
								source {
									_id
									name
									logoLink
								}
							}
						}
					`}

				render={({ error, props }) => {
					if (!props) {
						return <SplashScreen />
					} else if (error) {
						alert('error:' + JSON.stringify(error));
					}

					return (
						<Container>
							<OfflineNotice />
							<FlatList data={props.getArticles}
								keyExtractor={item => item._id}
								extraData={this.state}
								renderItem={({ item }) => {
									return <ArticleCard article={item}
										key={item._id}
										actions={this.props.actions}
										navigation={this.props.navigation} />
								}}
								refreshControl={
									<RefreshControl
										colors={['#9Bd35A', '#689F38']}
										onRefresh={this.handleRefresh.bind(this)}
									/>
								}
							/>
						</Container>
					);
				}}
			/>
		);
	}
}

function mapStateToProps (state) {
	return {
	};
}

function mapDispatchToProps (dispatch) {
	return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
