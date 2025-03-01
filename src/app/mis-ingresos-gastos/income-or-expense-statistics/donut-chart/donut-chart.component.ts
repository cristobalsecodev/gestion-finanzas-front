import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyCodeENUM } from 'src/app/shared/enums/Currency.enum';
import { FormatThousandSeparatorsPipe } from 'src/app/shared/pipes/FormatThousandSeparators/format-thousand-separators.pipe';
import { CurrencySymbolPipe } from 'src/app/shared/pipes/SimboloDivisa/currency-symbol.pipe';

export interface DonutChartData {
  category: string
  amount: number
  color: string
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [
    // Angular material
    MatTooltipModule,
    // Pipes
    FormatThousandSeparatorsPipe,
    CurrencySymbolPipe
  ],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent {

  // Datos del gráfico
  @Input() data: DonutChartData[] = []

  // Tamaño total del svg
  @Input() width = 192
  @Input() height = 192

  // Divisa seleccionada
  @Input() currencyCode: string = CurrencyCodeENUM.USD

  @ViewChild('donutChart', { static: true }) svgRef!: ElementRef<SVGElement>
  @ViewChild('tooltip', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>
  
  private svg!: SVGElement
  private tooltip!: HTMLDivElement
  private radius!: number
  private innerRadius!: number
  private total = 0

  constructor(
    private currencySymbolPipe: CurrencySymbolPipe,
    private formatThousandSeparatorsPipe: FormatThousandSeparatorsPipe
  ) {}
  
  ngOnInit(): void {

    this.svg = this.svgRef.nativeElement
    this.tooltip = this.tooltipRef.nativeElement

    // Asegurarse que el tooltip tenga los estilos correctos
    this.tooltip.classList.add('tooltip')
    this.tooltip.style.position = 'fixed'
    this.tooltip.style.pointerEvents = 'none'
    this.tooltip.style.backgroundColor = 'var(--component)'
    this.tooltip.style.color = 'var(--text-primary)'
    this.tooltip.style.borderRadius = '.5rem'
    this.tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
    this.tooltip.style.zIndex = '1000'
    this.tooltip.style.transition = 'opacity 0.2s'
    this.tooltip.style.minWidth = '180px'
    this.tooltip.style.opacity = '0'
  
  // Agregar evento para cerrar tooltip fijo al hacer clic fuera
  document.addEventListener('click', (e) => {

    if (!this.svg.contains(e.target as Node)) {

      document.querySelectorAll('.active-segment-fixed').forEach(el => {
        (el as HTMLElement).classList.remove('active-segment-fixed');
        (el as HTMLElement).style.transform = '';
        (el as HTMLElement).style.filter = '';
      })
      this.tooltip.classList.remove('tooltip-fixed')
      this.tooltip.style.opacity = '0'
      
    }

  });


    // Tamaño del radio
    this.radius = Math.min(this.width, this.height) / 2

    // Grosor del donut
    this.innerRadius = this.radius * 0.8
    
    // Calcular total y dibujar el gráfico
    if (this.data.length > 0) {
      this.calculateTotal()
      this.drawChart()
    }

  }
  
  ngOnChanges(changes: SimpleChanges): void {

    if ((changes['data'] && !changes['data'].firstChange) || changes['currencyCode']) {

      this.calculateTotal()
      this.clearChart()
      this.drawChart()

    }

  }
  
  private calculateTotal(): void {

    this.total = this.data.reduce((sum, item) => sum + item.amount, 0)
    
  }
  
  calculatePercentage(amount: number): string {
    
    return ((amount / this.total) * 100).toFixed(1)

  }
  
  private clearChart(): void {

    while (this.svg && this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild)
    }

  }
  
  private drawChart(): void {

    if(this.svg) {

      const svgns = "http://www.w3.org/2000/svg"
      const g = document.createElementNS(svgns, 'g')
      g.setAttribute('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      this.svg.appendChild(g)
      
      let startAngle = 0
      
      this.data.forEach((item, index) => {
  
        const angle = (item.amount / this.total) * Math.PI * 2
        const endAngle = startAngle + angle
        
        // Calculate points for the path
        const x1 = this.radius * Math.sin(startAngle)
        const y1 = -this.radius * Math.cos(startAngle)
        const x2 = this.radius * Math.sin(endAngle)
        const y2 = -this.radius * Math.cos(endAngle)
        
        const x1Inner = this.innerRadius * Math.sin(startAngle)
        const y1Inner = -this.innerRadius * Math.cos(startAngle)
        const x2Inner = this.innerRadius * Math.sin(endAngle)
        const y2Inner = -this.innerRadius * Math.cos(endAngle)
        
        const largeArcFlag = angle > Math.PI ? 1 : 0
        
        // Create path for slice
        const path = document.createElementNS(svgns, 'path')
  
        path.setAttribute('d', `
          M ${x1Inner} ${y1Inner}
          L ${x1} ${y1}
          A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${x2Inner} ${y2Inner}
          A ${this.innerRadius} ${this.innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
        `)
  
        path.setAttribute('fill', item.color)
        path.classList.add('slice')
        path.setAttribute('data-index', index.toString())
        
        // Add event listeners for tooltip
        this.addTooltipEvents(path, item)
        
        g.appendChild(path)
        startAngle = endAngle
  
      })
      
      // Texto del centro
      const centerText = document.createElementNS(svgns, 'text')
      centerText.setAttribute('text-anchor', 'middle')
      centerText.setAttribute('dominant-baseline', 'middle')
      centerText.setAttribute('font-size', '18px')
      centerText.setAttribute('font-weight', 'bold')
      centerText.textContent = 'Total'
      centerText.setAttribute('fill', 'var(--text-primary)') // Color del texto (gris oscuro)
      centerText.setAttribute('y', '-10') // Mover un poco hacia arriba
      g.appendChild(centerText)
  
      // Suma total del centro
      const totalText = document.createElementNS(svgns, 'text')
      totalText.setAttribute('text-anchor', 'middle')
      totalText.setAttribute('dominant-baseline', 'middle')
      totalText.setAttribute('font-size', '18px')
      totalText.setAttribute('font-weight', 'bold')
      totalText.setAttribute('y', '30')
      totalText.setAttribute('fill', 'var(--text-primary)') // Color del texto
      totalText.setAttribute('y', '20') // Distancia reducida
      totalText.textContent = `${this.formatThousandSeparatorsPipe.transform(this.total)} ${this.currencySymbolPipe.transform(0, this.currencyCode)}`
  
      g.appendChild(totalText)
  
    }

  }
  
  private addTooltipEvents(path: SVGPathElement, item: DonutChartData): void {

    // Variable para controlar el estado
    let isHovering = false
    
    path.addEventListener('mouseover', (e) => {

      isHovering = true
      
      // Obtener posición
      const mouseX = (e as MouseEvent).clientX
      const mouseY = (e as MouseEvent).clientY
      
      // Calcular porcentaje
      const percentage = ((item.amount / this.total) * 100).toFixed(1)
      
      // Mejorar el contenido del tooltip
      this.tooltip.innerHTML = `
        <div class="p-2">
          <div class="font-bold text-lg mb-1" style="color: ${item.color}">${item.category}</div>
          <div class="flex justify-between">
            <span>Amount:</span>
            <span class="font-medium">${item.amount.toLocaleString()} ${this.currencySymbolPipe.transform(0, this.currencyCode)}</span>
          </div>
          <div class="flex justify-between">
            <span>Percentage:</span>
            <span class="font-medium">${percentage}%</span>
          </div>
        </div>
      `

      // Hacer visible el tooltip para poder medir sus dimensiones reales
      this.tooltip.style.display = 'block'
      this.tooltip.style.opacity = '0' // Temporalmente invisible
      
      // Ahora podemos medir correctamente
      const tooltipWidth = this.tooltip.offsetWidth
      const tooltipHeight = this.tooltip.offsetHeight
      
      // Obtener dimensiones de la ventana
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // Calcular posición inicial
      let left = mouseX + 15
      let top = mouseY + 10
      
      // Comprobar límites - usar dimensiones de ventana en lugar de SVG
      if (left + tooltipWidth > windowWidth) {
        left = mouseX - tooltipWidth - 10
      }
      
      if (top + tooltipHeight > windowHeight) {
        top = mouseY - tooltipHeight - 10
      }
      
      // Asegurarse de que no se salga por la izquierda o arriba
      left = Math.max(10, left)
      top = Math.max(10, top)
      
      // Posicionar y mostrar tooltip
      this.tooltip.style.left = `${left}px`
      this.tooltip.style.top = `${top}px`
      this.tooltip.style.opacity = '1'
      
      // Destacar el segmento activo SIN moverlo
      path.classList.add('active-segment')
      // Usar solo cambios visuales sutiles que no mueven el elemento
      path.style.filter = 'brightness(1.1)'
      path.style.stroke = 'var(--text-secondary)'
      path.style.strokeWidth = '1px'

    })
    
    path.addEventListener('mousemove', (e) => {

      if (!isHovering) return
      
      const mouseX = (e as MouseEvent).clientX
      const mouseY = (e as MouseEvent).clientY
      
      // Obtener dimensiones actuales
      const tooltipWidth = this.tooltip.offsetWidth
      const tooltipHeight = this.tooltip.offsetHeight
      
      // Obtener dimensiones de la ventana
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // Calcular posición
      let left = mouseX + 15
      let top = mouseY + 10
      
      // Comprobar límites con la ventana completa
      if (left + tooltipWidth > windowWidth) {
        left = mouseX - tooltipWidth - 10
      }
      
      if (top + tooltipHeight > windowHeight) {
        top = mouseY - tooltipHeight - 10
      }
      
      // Asegurarse de que no se salga por la izquierda o arriba
      left = Math.max(10, left)
      top = Math.max(10, top)
      
      // Aplicar posición
      this.tooltip.style.left = `${left}px`
      this.tooltip.style.top = `${top}px`

    })
    
    path.addEventListener('mouseout', () => {

      isHovering = false
      
      // Ocultar tooltip
      this.tooltip.style.opacity = '0'
      
      // Restaurar segmento a estado normal
      path.classList.remove('active-segment')
      path.style.filter = ''
      path.style.stroke = ''
      path.style.strokeWidth = ''
      
      // Ocultar después de la transición
      setTimeout(() => {
        if (!isHovering) {
          this.tooltip.style.display = 'none'
        }
      }, 200);
    });
  }
}
