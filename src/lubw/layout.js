import { html } from "npm:htl";
import * as Plot from "npm:@observablehq/plot";
import { resize } from "observablehq:stdlib";

export function title(main, sub) {
    return html`
        <h1>${main}</h1>
        <h2>${sub}</h2>
    `
}

function tools({ download, info }) {
    const items = [];

    if (download !== null) {
        items.push(html`
            <a href='${download}' class="download-button" title='Download' aria-label='Download' download></a>
            `)
    }

    if (info !== null) {
        items.push(html`
            <button class="info-button" aria-label='Info' title='Info'></button>
            `)
    }

    if (items.length == 0) {
        return ''
    } else {
        return html`
            <div class="tools">
                ${items.join('')}
            </div>
        `
    }
}

function withInfo(body, info) {
    if (info === null) {
        return body
    } else {
        return html`
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
    return html`
        <div class="card">
            <div class="header">
                <div class="title">
                    <h2>${title}</h2>
                    <h3>${subtitle}</h3>
                </div> <!-- title -->
                ${tools({ download, info })}
            </div> <!-- header -->
            ${withInfo(body, info)}
        </div> <!-- card -->
`
}

function _plot(width, { marks, ...args }) {
    console.log('resize', width)
    return Plot.plot({
        width,
        grid: true,
        inset: 10,
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