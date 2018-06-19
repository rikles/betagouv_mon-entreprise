/* @flow */

import { compose } from 'ramda'
import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import SearchButton from '../SearchButton'
import { SimpleButton } from '../ui/Button'
import Card from '../ui/Card'
import withTracker from '../withTracker'
import Distribution from './Distribution'
import PaySlip from './PaySlip'
import './ResultView.css'
import type { Tracker } from '../withTracker'

type State = {
	resultView: 'distribution' | 'payslip'
}
type Props = {
	conversationStarted: boolean,
	tracker: Tracker
}

const resultViewTitle = {
	distribution: 'Mes cotisations',
	payslip: 'Ma fiche de paie'
}

class ResultView extends PureComponent<Props, State> {
	state = {
		resultView: this.props.conversationStarted ? 'payslip' : 'distribution'
	}
	handleClickOnTab = resultView => () => {
		this.setState({ resultView })
		this.props.tracker.push(['trackEvent', 'results', 'selectView', resultView])
	}
	render() {
		return (
			<>
				<div className="result-view__header">
					<div className="result-view__tabs">
						{['distribution', 'payslip'].map(resultView => (
							<SimpleButton
								key={resultView}
								className={
									this.state.resultView === resultView ? 'selected' : ''
								}
								onClick={this.handleClickOnTab(resultView)}>
								<Trans>{resultViewTitle[resultView]}</Trans>
							</SimpleButton>
						))}
					</div>
					<SearchButton />
				</div>
				<Card className="result-view__body">
					{this.state.resultView === 'payslip' ? <PaySlip /> : <Distribution />}
				</Card>
			</>
		)
	}
}

export default compose(
	withTracker,
	connect(
		state => ({
			conversationStarted: state.conversationStarted,
			key: state.conversationStarted
		}),
		{}
	)
)(ResultView)
