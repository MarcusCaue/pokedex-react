// Import statements
import api from "./tools/api"
import { FormEvent, useEffect, useRef, useState } from "react"
import { Pokemon } from "./classes/Pokemon"
import { InformationsPokemon } from "./components/containers/InformationsPokemon"
import { GetFormPokemon } from "./components/containers/GetFormPokemon"
// Interfaces
import { ImgOptions, Stats, TypesPokemonPokeApi } from "./interfaces/index"
// Styles
import { Body, ResetGlobalCss, HeaderPage } from "./styles/general/index.style"
import { StyledSearchPokemon } from "./styles/containers/StyledSearchPokemon.style"
import { StyledTeamPokemon } from "./styles/containers/StyledTeamPokemon.style"
import { Container } from "./styles/containers/StyledContainer.style"

export default function App() {
  // States
  const [ pokemonImg,  setPokemonImg  ] = useState<ImgOptions>()
  const [ optionImage, setOptionImage ] = useState('official')
  const [ pokemon, setPokemon ] = useState<Pokemon>()

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)

  // Functions
  function submitForm(event: FormEvent) {
    event.preventDefault()
    const inputRefValue = inputRef.current?.value
    if (inputRefValue !== undefined)
      getPokemon(inputRefValue)
  }
  async function getPokemon(name: string) {

    const response = await api.get("/" + name)
    const data = response.data

    const img: ImgOptions = {
      "official": data.sprites.other["official-artwork"].front_default,
      "pixelated": data.sprites.front_default,
      "animated": data.sprites.versions['generation-v']['black-white'].animated.front_default
    }

    const statsOfNewPokemon : Stats = {
      hp: data.stats[0].base_stat,
      speed: data.stats[5].base_stat,
      attack: data.stats[1].base_stat, specialAttack: data.stats[3].base_stat,
      defense: data.stats[2].base_stat, specialDefense: data.stats[4].base_stat
    }

    const newPokemon = new Pokemon(
      data.name,
      data.types.map((typeElement : TypesPokemonPokeApi) => typeElement.type.name),
      statsOfNewPokemon
    )

    setPokemonImg(img)
    setPokemon(newPokemon)

  }

  useEffect(() => {
    // getPokemon("lugia")
    setPokemonImg({
      official: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png",
      animated: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/249.gif",
      pixelated: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png"
    })

    const statsPokemonTest: Stats = {
      hp: 1,
      attack: 1,
      defense: 1,
      specialAttack: 1,
      specialDefense: 1,
      speed: 1
    } 

    const pokemonTest = new Pokemon(
      "lugia",
      [ "psychic", "flying" ],
      statsPokemonTest
    )

    setPokemon(pokemonTest)
  }, [])

  return (
    <>
      <ResetGlobalCss $darkModeActived={true} />
      <Body>
        <HeaderPage> Monte o seu Time de Pokemons!</HeaderPage>

        <Container>
          <StyledSearchPokemon>
            <InformationsPokemon 
              imagesOfPokemon={pokemonImg} 
              pokemon={pokemon} 
              optionImageChoiced={optionImage} 
            />
            <GetFormPokemon 
              submitFormFunction={submitForm} 
              refInput={inputRef} 
              optionImageChoiced={optionImage} 
              changeOptionImage={setOptionImage} 
            />
          </StyledSearchPokemon>

          <StyledTeamPokemon>
            Aqui haverá futuramente o time de Pokemons que o usuário criou! <br />
            Aguarde! ;)
          </StyledTeamPokemon>
        </Container>
      </Body>
    </>
  )
}