import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurizarSVGsService {

  constructor(private sanitizer: DomSanitizer) {}

  securizeSVGs(SVGs: { [key: string]: string }): { [key: string]: SafeHtml } {

    const securizedSVGs: { [key: string]: SafeHtml } = {}

    // Securizar cada SVG
    for (const [key, svg] of Object.entries(SVGs)) {
      securizedSVGs[key] = this.sanitizer.bypassSecurityTrustHtml(svg)
    }

    return securizedSVGs
  }
}
