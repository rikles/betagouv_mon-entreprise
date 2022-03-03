import { Grid } from '@mui/material'
import SearchRules from 'Components/search/SearchRules'
import { FromBottom } from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import Meta from 'Components/utils/Meta'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Button } from 'DesignSystem/buttons'
import { Spacing } from 'DesignSystem/layout'
import { H1, H2, H3, H4, H5 } from 'DesignSystem/typography/heading'
import { Link, StyledLink } from 'DesignSystem/typography/link'
import { Li, Ul } from 'DesignSystem/typography/list'
import { Body } from 'DesignSystem/typography/paragraphs'
import rules, { DottedName } from 'modele-social'
import { getDocumentationSiteMap, RulePage } from 'publicodes-react'
import { ComponentType, useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import styled from 'styled-components'
import { TrackPage } from '../ATInternetTracking'
import RuleLink from '../components/RuleLink'
import { capitalise0 } from '../utils'

export default function MonEntrepriseRulePage() {
	const engine = useEngine()
	const documentationPath = useContext(SitePathsContext).documentation.index
	const { pathname } = useLocation()
	const documentationSitePaths = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	const { i18n } = useTranslation()

	if (pathname === '/documentation') {
		return <DocumentationLanding />
	}

	if (pathname === '/documentation/dev') {
		return <DocumentationRulesList />
	}

	if (!documentationSitePaths[pathname]) {
		return <Redirect to="/404" />
	}

	return (
		<FromBottom>
			<TrackPage
				chapter1="documentation"
				name={documentationSitePaths[pathname]}
			/>
			<ScrollToTop key={pathname} />
			<Grid item md={10}>
				<BackToSimulation />
				<Spacing xl />
				<Route
					path={documentationPath + '/:name+'}
					render={({ match }) =>
						match.params.name && (
							<StyledDocumentation>
								<RulePage
									language={i18n.language as 'fr' | 'en'}
									rulePath={match.params.name}
									engine={engine}
									documentationPath={documentationPath}
									renderers={{
										Head: Helmet,
										Link: Link as ComponentType<{
											to: string
										}>,
										Text: Markdown,
										References,
									}}
								/>
							</StyledDocumentation>
						)
					}
				/>
			</Grid>
		</FromBottom>
	)
}

function BackToSimulation() {
	const url = useSelector((state: RootState) => state.simulation?.url)
	if (!url) {
		return null
	}
	return (
		<>
			<Spacing lg />
			<Button to={url}>
				← <Trans i18nKey="back">Retourner à la simulation</Trans>
			</Button>
		</>
	)
}

function DocumentationLanding() {
	return (
		<>
			<TrackPage chapter1="documentation" name="accueil" />
			<Meta
				page="documentation"
				title="Documentation"
				description="Explorez toutes les règles de la documentation"
			/>
			<H1>
				<Trans i18nKey="page.documentation.title">Documentation</Trans>
			</H1>
			<Body>Explorez toutes les règles de la documentation</Body>
			<SearchRules />
		</>
	)
}

function DocumentationRulesList() {
	const ruleEntries = Object.keys(rules) as DottedName[]
	return (
		<>
			<H1>Liste des règles</H1>
			{ruleEntries.map((name) => (
				<RuleLink dottedName={name} key={name}>
					{name}
				</RuleLink>
			))}
		</>
	)
}

const referencesImages = {
	'service-public.fr': '/références-images/marianne.png',
	'legifrance.gouv.fr': '/références-images/marianne.png',
	'urssaf.fr': '/références-images/Urssaf.svg',
	'secu-independants.fr': '/références-images/Urssaf.svg',
	'gouv.fr': '/références-images/marianne.png',
	'agirc-arrco.fr': '/références-images/agirc-arrco.png',
	'pole-emploi.fr': '/références-images/pole-emploi.png',
	'ladocumentationfrançaise.fr':
		'/références-images/ladocumentationfrançaise.png',
	'senat.fr': '/références-images/senat.png',
	'ameli.fr': '/références-images/ameli.png',
	'bpifrance-creation.fr': '/références-images/bpi-création.png',
}

type ReferencesProps = {
	references: React.ComponentProps<
		NonNullable<
			React.ComponentProps<typeof RulePage>['renderers']['References']
		>
	>['references']
}

export function References({ references }: ReferencesProps) {
	const cleanDomain = (link: string) =>
		(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
			'www.',
			''
		)

	return (
		<StyledReferences>
			{Object.entries(references).map(([name, link]) => {
				const domain = cleanDomain(link)
				return (
					<li key={name}>
						<span className="imageWrapper">
							{Object.keys(referencesImages).includes(domain) && (
								<img
									src={
										referencesImages[domain as keyof typeof referencesImages]
									}
									alt={`logo de ${domain}`}
								/>
							)}
						</span>
						<a href={link} target="_blank" rel="noreferrer">
							{capitalise0(name)}
						</a>
						<span className="ui__ label">{domain}</span>
					</li>
				)
			})}
		</StyledReferences>
	)
}

const StyledReferences = styled.ul`
	list-style: none;
	padding: 0;
	a {
		flex: 1;
		min-width: 45%;
		text-decoration: underline;
		margin-right: 1rem;
	}

	li {
		margin-bottom: 0.6em;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.imageWrapper {
		width: 4.5rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
	img {
		max-height: 3rem;
		vertical-align: sub;
		max-width: 100%;
		border-radius: 0.3em;
	}
`

type OverrideComponentType = {
	componentStyle: {
		rules: Array<
			| ((
					props: Record<string, unknown>
			  ) =>
					| string
					| false
					| null
					| undefined
					| OverrideComponentType['componentStyle']['rules'])
			| string
		>
	}
}

// HACKKKKY THING. DO NOT DO THIS AT HOME
function componentCSS(Compo: unknown, props: Record<never, never>): string {
	const rules =
		'componentStyle' in (Compo as OverrideComponentType)
			? (Compo as OverrideComponentType).componentStyle.rules
			: (Compo as string[])

	return rules
		.map((x) => {
			if (typeof x !== 'function') {
				return x
			}
			const result = x(props)
			if ((result ?? false) === false) {
				return ''
			}
			if (typeof result === 'string') {
				return result
			}
			if (Array.isArray(result)) {
				return componentCSS(result, props)
			}
			// eslint-disable-next-line no-console
			console.error('Should not happen', result, typeof result)
		})
		.join('')
}

const StyledDocumentation = styled.div`
	h1 {
		${(props) => componentCSS(H1, props)}
		margin-top: 1rem;
	}
	h2 {
		${(props) => componentCSS(H2, props)}
	}
	h3 {
		${(props) => componentCSS(H3, props)}
	}
	h4 {
		${(props) => componentCSS(H4, props)}
	}
	h5 {
		${(props) => componentCSS(H5, props)}
	}
	p {
		${(props) => componentCSS(Body, props)}
	}
	Ul {
		${(props) => componentCSS(Ul, props)}
	}
	Li {
		${(props) => componentCSS(Li, props)}
	}
	a {
		${(props) => componentCSS(StyledLink, props)}
	}
	button {
		font-size: 1rem;
		font-family: ${({ theme }) => theme.fonts.main};
	}
	font-size: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
	line-height: 1.5rem;
`
