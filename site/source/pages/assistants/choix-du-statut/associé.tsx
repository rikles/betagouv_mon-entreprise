import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { FromTop } from '@/components/ui/animate'
import { useEngine } from '@/components/utils/EngineContext'
import { usePersistingState } from '@/components/utils/persistState'
import {
	Message,
	Radio,
	RadioCard,
	RadioCardGroup,
	ToggleGroup,
} from '@/design-system'
import { HelpButtonWithPopover } from '@/design-system/buttons'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { batchUpdateSituation } from '@/store/actions/actions'

import Layout from './_components/Layout'
import Navigation from './_components/Navigation'

type State = {
	question1: 'seul' | 'plusieurs' | undefined
	question2: 'oui' | 'non' | undefined
}

export default function Associés() {
	const { t } = useTranslation()

	const [{ question1, question2 }, setState, reset, isComplete] =
		useAssociésSelection()

	return (
		<>
			<Layout
				title={
					<Trans i18nKey="choix-statut.associés.title">
						Je gère cette entreprise...
						<HelpButtonWithPopover
							title={t(
								'choix-statut.associés.help.title',
								'Être plusieurs associé(e)s ou actionnaires'
							)}
							type="info"
						>
							<Body>
								Vous <Strong>partagez la propriété de votre entreprise </Strong>
								avec d’autres personnes qui peuvent être{' '}
								<Strong>physiques</Strong> (individus) ou{' '}
								<Strong>morales</Strong> (sociétés).
							</Body>
							<Body>
								Dans le cas des <Strong>sociétés par actions</Strong> (SASU,
								SAS), on parle d’
								<Strong>actionnaires</Strong>.
							</Body>
						</HelpButtonWithPopover>
					</Trans>
				}
			>
				<RadioCardGroup
					aria-label={t(
						'choix-statut.associés.question1',
						'Comment gérez-vous cette entreprise ?'
					)}
					onChange={(value) =>
						setState({ question1: value as State['question1'] })
					}
					value={question1}
				>
					<RadioCard
						value={'seul'}
						label={
							<Trans i18nKey="choix-statut.associés.question1.seul">Seul</Trans>
						}
					/>
					<RadioCard
						value={'plusieurs'}
						label={
							<Trans i18nKey="choix-statut.associés.question1.plusieurs">
								À plusieurs
							</Trans>
						}
					/>
				</RadioCardGroup>
				{question1 === 'seul' && (
					<FromTop>
						<Spacing md />
						<Message type="secondary" border={false}>
							<H4 id="question2">
								<Trans i18nKey="choix-statut.associés.question2">
									Envisagez-vous d’ajouter des associé(e)s dans un second temps
									?
								</Trans>
							</H4>
							<ToggleGroup
								aria-labelledby="question2"
								onChange={(value) =>
									setState({ question2: value as State['question2'] })
								}
								value={question2}
							>
								<Radio value={'oui'}>
									<Trans>Oui</Trans>
								</Radio>
								<Radio value={'non'}>
									<Trans>Non</Trans>
								</Radio>
							</ToggleGroup>
							<Spacing md />
						</Message>
					</FromTop>
				)}

				<Navigation currentStepIsComplete={isComplete} onPreviousStep={reset} />
			</Layout>
		</>
	)
}

function useAssociésSelection(): [
	state: State,
	setState: (value: Partial<State>) => void,
	reset: () => void,
	isComplete: boolean
] {
	const [state, setState] = usePersistingState<State>('choix-statut:associés', {
		question1: undefined,
		question2: undefined,
	})

	const dispatch = useDispatch()

	const handleChange = (value: Partial<State>) => {
		const newState = { ...state, ...value }
		setState(newState)
		dispatch(
			batchUpdateSituation({
				'entreprise . associés':
					newState.question1 === 'seul'
						? "'unique'"
						: newState.question1 === 'plusieurs'
						? "'multiples'"
						: undefined,
				// On préfère conseiller l'EI à l'EURL pour les entrepreneurs seuls (dans un premier temps)
				'entreprise . catégorie juridique . EI':
					newState.question2 === 'oui' ? 'non' : undefined,
				'entreprise . catégorie juridique . SARL . EURL':
					newState.question2 === 'non' ? 'non' : undefined,
			})
		)
	}

	useEffect(() => {
		handleChange(state)
	}, [])
	const reset = () => {
		handleChange({
			question1: undefined,
			question2: undefined,
		})
	}

	const isComplete =
		useEngine().evaluate('entreprise . associés').nodeValue !== undefined

	return [state, handleChange, reset, isComplete]
}
