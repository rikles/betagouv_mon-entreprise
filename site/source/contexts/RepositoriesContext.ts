import { createContext } from 'react'

import { RechercheEntreprisesGouvFr } from '@/api/RechercheEntreprise/RechercheEntreprisesGouvFr'
import { EntreprisesRepository } from '@/domain/EntreprisesRepository'

interface Repositories {
	entreprises: EntreprisesRepository
}

export const RepositoriesContext = createContext<Repositories>({
	entreprises: RechercheEntreprisesGouvFr,
})
