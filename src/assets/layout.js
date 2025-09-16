import { html } from "npm:htl";
import * as Plot from "npm:@observablehq/plot";
import { FileAttachment } from "observablehq:stdlib";
import { resize } from "observablehq:stdlib";

export function title(main, sub) {
    return html.fragment`
        <h1>${main}</h1>
        <h2>${sub}</h2>
    `
}

export function random_id() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return "id_" + S4() + S4() + S4();
}

function tools({ body, download, info, card_id }) {
    const items = [];

    if (download !== null) {
        items.push(html.fragment`
            <a href='${download}' class="download-button" title='Download' aria-label='Download' download></a>
            `)
    }

    if (body !== null && info !== null) {
        var js = `document.getElementById("${card_id}").classList.toggle('flip')`;
        items.push(html.fragment`
            <button class="info-button" aria-label='Info' title='Info' onclick=${js}></button>
            `)
    }

    if (items.length == 0) {
        return ''
    } else {
        return html.fragment`
            <div class="tools">
                ${items}
            </div>
        `
    }
}

function withInfo(body, info) {
    if (info === null) {
      // body only
      return body
    } else if (body === null) {
      // info only: static flip
      return html.fragment`
          <div class='with-info'>
              <div class='info'>
                  ${info}
              </div>
          </div>
      `
    } else {
      // body and info: flip button
      return html.fragment`
          <div class='with-info'>
              <div class='body'>
                  ${body}
              </div>
              <div class='info'>
                  ${info}
              </div>
          </div>
      `
    }
}

export function card({
    title,
    subtitle,
    body = null,
    download = null,
    info = null,
}) {
    var card_id = random_id();
    var cls = "card";
    if (body === null && info !== null) {
      cls += " flip";
    };
    return html.fragment`
        <div id=${card_id} class=${cls}>
            <div class="header">
                <div class="title">
                    <h2>${title}</h2>
                    <h3>${subtitle}</h3>
                </div> <!-- title -->
                ${tools({ body, download, info, card_id })}
            </div> <!-- header -->
            ${withInfo(body, info)}
        </div> <!-- card -->
`
}

function _plot(width, { x, y, marks, ...args }) {
    console.log('resize', width)
    return Plot.plot({
        width,
        grid: true,
        inset: 10,
        x: {
            labelAnchor: 'center',
            labelArrow: 'none',
            ...x,
        },
        y: {
            label: '',
            labelArrow: 'none',
            ...y,
        },
        marks: [
            Plot.frame(),
            ...marks
        ],
        ...args,
    })
}

export function plot(args) {
    return resize((width) => _plot(width, args))
}

export function sponsors() {
    const bmwsb = FileAttachment("/assets/sponsor-BMWSB.svg").href
    const kfw = FileAttachment("/assets/sponsor-KFW.png").href
    return html.fragment`
        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <img
            style="flex: 0 1 auto; max-width: 20rem; width: 100%;"
            title="Smart City Sponsor"
            alt="Gefördert durch das Bundensministerium für Wohnen, Stadtentwicklung und Bauwesen"
            src=${bmwsb}
        />
        <img
            style="flex: 0 1 auto; max-width: 15rem; width: 100%;"
            title="Smart City Sponsor"
            alt="Gefördert durch die Kreditanstalt für Wiederaufbau (KFW)"
            src=${kfw}
        />
        </div>
    `
}
