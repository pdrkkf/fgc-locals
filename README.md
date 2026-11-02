# Viver é lutar, lutar é viver!

![Tela inicial do mapa da FGC no Brasil](docs/mapa-inicial.png)

## Locals da FGC no Brasil

Mapa comunitário das locals de jogos de luta no Brasil. As posições são aproximadas pelo município informado nas referências.

## Roadmap

- **Versão mobile:** melhorar a experiência em celulares, incluindo navegação pelo mapa e acesso à lista de locais.
- **Links e redes sociais:** adicionar aos locais links para redes sociais, comunidades e outras fontes com mais informações.
- **Mantenedores:** encontrar pessoas da comunidade para ajudar a verificar e atualizar os dados, revisar contribuições e cuidar da evolução do projeto.

As ideias não têm prazo definido. Contribuições e pessoas interessadas em ajudar são bem-vindas.

## Acesso e incorporação

O mapa pode ser incorporado diretamente por uma URL de embed ou dentro de um `iframe`. Use estes parâmetros para configurar a exibição:

| Parâmetro | Valores | Descrição |
| --- | --- | --- |
| `embed` | `1` | Abre o mapa em modo compacto, próprio para incorporação. |
| `theme` | `blue`, `red` ou `yellow` | Define o tema inicial do mapa. |
| `hide` | `theme` | Oculta o seletor de tema. Use junto com `embed=1`; o tema informado em `theme` continua aplicado. |

### URL de embed direto

```text
https://pdrkkf.github.io/fgc-locals/?embed=1&theme=blue&hide=theme
```

### Incorporação via iframe

```html
<iframe
  src="https://pdrkkf.github.io/fgc-locals/?embed=1&theme=red&hide=theme"
  title="Mapa de locals da FGC no Brasil"
  loading="lazy"
  style="width:100%;height:680px;border:0;border-radius:8px"
></iframe>
```

## Como adicionar um local

Os registros ficam no array `places`, dentro de `dist/index.html`. Cada linha usa este formato:

```js
[id, nome, cidade, UF, parte, latitude, longitude]
```

Exemplo:

```js
[41, 'Nova Local', 'Belo Horizonte', 'MG', 1, -19.9167, -43.9345]
```

Preencha os campos assim:

| Campo | O que informar |
| --- | --- |
| `id` | Número único e crescente. Não reutilize IDs existentes. |
| `nome` | Nome público da comunidade ou do evento local. |
| `cidade` | Município que deve aparecer no diretório. Use o mesmo nome em registros da mesma cidade. |
| `UF` | Sigla oficial do estado, em maiúsculas, como `MG` ou `SP`. |
| `parte` | Número da parte/referência de onde veio o registro, quando aplicável. É mantido nos dados, mas não altera a interface. |
| `latitude`, `longitude` | Coordenadas decimais aproximadas do município. Latitude sul e longitude oeste são negativas. |

### Logo do local

1. Prepare a imagem em WebP, com **480 × 360 px**. Recorte margens excessivas; use transparência quando combinar com a logo.
2. Salve em `dist/assets/poi-images/` como `poi-<id com 2 dígitos>-<slug>.webp`. Exemplo: `poi-41-nova-local.webp`.
3. Adicione o mesmo slug ao array `poiImageSlugs`, na mesma posição do local em `places`.

O `manifest.json` é apenas um catálogo e não é necessário para o mapa carregar a imagem. Atualize-o se quiser registrar a origem da logo.

### Informações para registrar

Inclua o nome do local, cidade, UF, coordenadas e a parte da referência, quando houver. Para manter o diretório confiável, confira a cidade e a localização antes de adicionar. Registre a origem da informação e da imagem para que os créditos possam ser mantidos.

## Estrutura principal

```text
dist/
├── index.html                   # Interface, dados dos locals e slugs das logos
├── states.geojson               # Limites estaduais usados pelo mapa
└── assets/poi-images/
    ├── manifest.json            # Índice, dimensões e origem das logos
    └── poi-*.webp               # Logos otimizadas dos locais
.github/workflows/pages.yml      # Publicação automática no GitHub Pages
LICENSE                          # Licença MIT do código e da documentação
THIRD_PARTY_NOTICES.md           # Aviso e licença da biblioteca Leaflet
```

## Créditos e dependências

Mapa mantido pela comunidade. Créditos: Kinomoto / Odakechi / CarolTheQueen / [Karkaroff](https://github.com/pdrkkf/fgc-locals).

O mapa usa [Leaflet 1.9.4](https://leafletjs.com/) para a interface cartográfica, carregado pelo CDN unpkg sob a licença BSD 2-Clause. O aviso de direitos autorais e o texto da licença estão em [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

### Aviso sobre logos e marcas

As logos, marcas e demais imagens exibidas pertencem aos seus respectivos donos, que mantêm todos os direitos sobre esses materiais. Elas são usadas no mapa apenas para identificar os locais. A licença MIT deste projeto não concede autorização para copiar, modificar ou redistribuir essas logos e marcas; consulte os titulares para obter permissão de uso. O arquivo `dist/states.geojson` não contém metadados que identifiquem a fonte cartográfica original; antes de substituir ou redistribuir esses limites separadamente, confirme e registre a fonte e as condições aplicáveis.

## Licença

O código e a documentação deste projeto são distribuídos sob a licença **MIT**. O uso e as alterações são gratuitos; você pode copiar, modificar e redistribuir esse material, mantendo o aviso de copyright e o texto da licença. Consulte [`LICENSE`](LICENSE). A licença MIT não cobre as logos, marcas ou outros materiais de terceiros descritos acima.
