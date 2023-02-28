import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Appear } from '@/components/ui/animate'
import { Chip } from '@/design-system'
import InfoBulle from '@/design-system/InfoBulle'
import { Button } from '@/design-system/buttons'
import { ChevronIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { H3, H4 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'

interface ResultProps {
	debug: string | null
	item: {
		title: string
		codeApe: string
		contenuCentral: string[]
		contenuAnnexe: string[]
		contenuExclu: string[]
	}
}

export const Result = ({ item, debug }: ResultProps) => {
	const { title, codeApe, contenuCentral, contenuAnnexe, contenuExclu } = item
	const [open, setOpen] = useState(false)
	const { t } = useTranslation()

	return (
		<Grid container style={{ alignItems: 'center' }}>
			<Grid item xs={12} sm={8} md={9} xl={10}>
				<H3 style={{ marginTop: 0, marginBottom: '.5rem' }}>
					{title} <Chip type="secondary">{codeApe}</Chip>
					{debug && (
						<InfoBulle>
							<pre>{debug}</pre>
						</InfoBulle>
					)}
				</H3>
			</Grid>

			<StyledGrid item xs={12} sm={4} md={3} xl={2}>
				<Button
					light
					size="XXS"
					onPress={() => setOpen((x) => !x)}
					aria-expanded={open}
					aria-controls={`info-${codeApe}`}
					aria-label={!open ? t('En savoir plus') : t('Replier')}
				>
					{!open ? t('En savoir plus') : t('Replier')}{' '}
					<StyledChevron aria-hidden $isOpen={open} />
				</Button>
			</StyledGrid>

			{open && (
				<Appear id={`info-${codeApe}`}>
					{contenuCentral.length ? (
						<>
							<H4>Contenu central de cette activité :</H4>
							<Ul>
								{contenuCentral.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuAnnexe.length ? (
						<>
							<H4>Contenu annexe de cette activité :</H4>
							<Ul>
								{contenuAnnexe.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}

					{contenuExclu.length ? (
						<>
							<H4>Contenu exclu de cette activité :</H4>
							<Ul>
								{contenuExclu.map((contenu, i) => (
									<Li key={i}>{contenu}</Li>
								))}
							</Ul>
						</>
					) : null}
				</Appear>
			)}
		</Grid>
	)
}

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: end;
	align-items: center;
`

const StyledChevron = styled(ChevronIcon)<{ $isOpen: boolean }>`
	vertical-align: middle;
	transform: rotate(-90deg);
	transition: transform 0.3s;
	${({ $isOpen }) =>
		!$isOpen &&
		css`
			transform: rotate(90deg);
		`}
`