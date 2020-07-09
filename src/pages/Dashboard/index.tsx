import React, { useState, useEffect,  FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'


import logoImage from '../../assets/logo.svg'

import { Title, Form, Repositories,Error } from './styles';


interface Repository {
   full_name: string;
   description: string;
   owner: {
      login: string;
      avatar_url: string;

   }
}
const Dashboard: React.FC = () => {
   const [newRepo, setNewRepo] = useState('');
   const [repositories, setRepositories] = useState<Repository[]>(()=>{
      const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');
      if(storagedRepositories){
         return JSON.parse(storagedRepositories)
      }else{
         return []
      }
   });
   const [inputError, setInputError] = useState('');

   useEffect(()=>{
      localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
   },[repositories])

   async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
      event.preventDefault();

      if (!newRepo) {
         setInputError('Digite autor/nome do repositório.')
         return;
      }

      try{
         const response = await api.get<Repository>(`repos/${newRepo}`)

         const repository = response.data

         setRepositories([...repositories, repository])
         setNewRepo('')
         setInputError('')

      }catch(err){
         setInputError('Erro na busca deste repositório.')
      }
   }


   return (
      <>
         <img src={logoImage} alt='Github Explorer' />
         <Title>Explore repositórios no Github.</Title>

         {/* truthy = alguma coisa que repesente algo, true,1,  falsy algum que representa false, 0, undefined, null
            usando !! a variavel sera convertida uma primeira vez, de true pra false ou false pra true e depois convertida de volta */}
         <Form hasError={!!inputError} onSubmit={handleAddRepository}>
            <input
               value={newRepo}
               onChange={(e) => setNewRepo(e.target.value)}
               placeholder='Digite o nome do repositório'
            />
            <button type="submit">Pesquisar</button>
         </Form>

         {inputError && <Error>{inputError}</Error>}
         <Repositories>
            {repositories.map(repository => (
               <Link
                  key={repository.full_name}
                  to={`/repository/${repository.full_name}`}>
                  <img src={repository.owner.avatar_url}
                     alt={repository.owner.login} />
                  <div>
                     <strong>{repository.full_name}</strong>
                     <p>{repository.description}</p>
                  </div>
                  <FiChevronRight size={20} />
               </Link>
            ))}

         </Repositories>
      </>
   )
}

export default Dashboard;
