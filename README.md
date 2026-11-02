# Viver é lutar, lutar é viver!

## Locals da FGC no Brasil

Mapa comunitário de eventos e comunidades de jogos de luta no Brasil. As posições são aproximadas pelo município informado nas referências.

## Acesso e incorporação

O site é estático e pode ser hospedado no GitHub Pages. Para publicar, envie o repositório para o GitHub na branch `main` e escolha **GitHub Actions** em **Settings → Pages**. O workflow `.github/workflows/pages.yml` publica o conteúdo de `dist/` a cada push na branch `main`.

Para abrir o mapa em modo compacto, use `?embed=1`. O tema inicial é configurado pelo parâmetro `theme`:

| Valor | Tema |
| --- | --- |
| `blue` | Azul |
| `red` | Vermelho |
| `yellow` | Amarelo |

Exemplo de URL:

```text
https://<usuario>.github.io/<repositorio>/?embed=1&theme=red
```

Exemplo de iframe:

```html
<iframe
  src="https://<usuario>.github.io/<repositorio>/?embed=1&theme=blue"
  title="Mapa de locals da FGC no Brasil"
  loading="lazy"
  style="width:100%;height:680px;border:0;border-radius:8px"
></iframe>
```

Troque `blue` por `red` ou `yellow` para definir outro tema. Cada embed inicia no tema indicado na URL.

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

1. Prepare uma imagem quadrada ou retangular em tela de **480 × 360 px (proporção 4:3)**.
2. Salve em **WebP**, mantendo a proporção, centralizando a marca e recortando o excesso de margem. Evite adicionar faixas brancas ou verdes. Use fundo transparente quando fizer sentido para a logo.
3. Salve em `dist/assets/poi-images/` com o padrão `poi-<id com 2 dígitos>-<slug>.webp`. Exemplo: `poi-41-nova-local.webp`.
4. Acrescente o slug correspondente ao final do array `poiImageSlugs` em `dist/index.html`, na mesma ordem do novo registro em `places`.
5. Acrescente a imagem em `dist/assets/poi-images/manifest.json`, informando `id`, `name`, `filename`, `width`, `height` e a origem da imagem em `source`. Se a imagem tiver sido recortada, registre também o recorte.

Cada registro em `places` deve ter um slug na mesma posição em `poiImageSlugs`. Ao terminar, confira se o `id` bate com o nome do arquivo, se a quantidade de registros e slugs é igual e se a logo aparece no mapa e na lista.

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

## Desenvolvimento local

Sirva a pasta `dist/` com um servidor HTTP local. A página carrega `states.geojson` e as imagens por caminhos relativos; abrir `index.html` diretamente via `file://` pode impedir o carregamento desses arquivos.
