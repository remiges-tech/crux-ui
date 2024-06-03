import { Component, Input, OnInit } from '@angular/core';
import { TraceData } from 'src/models/common-interfaces';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input({ required: true }) Height: number = 50;
  @Input({ required: true }) Width: number = 50;
  @Input({ required: true }) traceData: TraceData[] = [];
  color: any = { '+': 'green', '-': 'red', '+c': 'blue', '-c': 'orange' };

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private zoomLevel: number = 1;
  private isDragging: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private cameraOffset = { x: 0, y: 0 };
  private MAX_ZOOM: number = 5;
  private MIN_ZOOM: number = 0.1;

  ngOnInit() {
    this.initializeCanvas();
  }

  initializeCanvas(): void {
    this.canvas = document.querySelector('canvas')!;
    if (this.canvas) {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
      this.context = this.canvas.getContext('2d')!;
      this.handleZoom();
      this.handleDrag();
      this.draw();
    }
  }

  draw() {
    const ctx = this.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(this.cameraOffset.x, this.cameraOffset.y);
    ctx.scale(this.zoomLevel, this.zoomLevel);
    this.renderTracedata(ctx, 200, 50);
    ctx.restore();
  }

  renderTracedata(context: CanvasRenderingContext2D, width: number, height: number): void {
    const xStart = 50;
    const yStart = 5;
    const bufferGap = 100;
    let X = xStart;
    let Y = yStart;
    for (let i = 1; i <= this.traceData.length; i++) {
      let sArrowX = xStart;
      let eArrowX = xStart + width + bufferGap;
      if (i % 2 == 0) {
        eArrowX = xStart + width;
        sArrowX = xStart + width + bufferGap;
        X = xStart + width + bufferGap;
      } else {
        eArrowX = xStart + width + bufferGap;
        sArrowX = xStart + width;
        X = xStart;
      }
      Y = this.makeShapeAndAddText(context, this.traceData[i - 1], X, Y + (width / 2), width, height);
      if (i > 0 && i != this.traceData.length) {
        this.drawArrow(context, sArrowX, Y + height / 2, eArrowX, Y + (width / 2));
      }
    }
  }

  makeShapeAndAddText(context: CanvasRenderingContext2D, data: any, x: number, y: number, width: number, height: number): number {
    const gap = 20;
    let newY = y;
    context.fillStyle = 'black';
    context.textBaseline = "bottom";
    context.fillText(data.setName, x, y - 5, width + 2 * gap);

    for (let i = 0; i < data.rules.length; i++) {
      const rule = data.rules[i];
      const ruleHeight = height + gap;
      newY = y + i * ruleHeight;

      if (i > 0) {
        this.drawArrow(context, x + width / 2, newY - ruleHeight + height, x + width / 2, newY);
      }

      context.strokeStyle = this.color[rule.res];
      context.strokeRect(x, newY, width, height);

      context.fillStyle = 'blue';
      context.font = '10px Arial';
      context.fillText(`rule ${rule.r}`, x + 5, newY + height / 2, width - 10);
    }

    context.strokeStyle = 'black';
    const totalHeight = (height + gap) * (data.rules.length);
    context.strokeRect(x - gap, y - (1.5 * gap), width + 2 * gap, totalHeight + gap * 2);

    return newY;
  }

  drawArrow(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color = 'black'): void {
    const headlen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    context.save();
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

    context.beginPath();
    context.moveTo(toX, toY);
    context.lineTo(toX - headlen * Math.cos(angle - Math.PI / 7), toY - headlen * Math.sin(angle - Math.PI / 7));
    context.lineTo(toX - headlen * Math.cos(angle + Math.PI / 7), toY - headlen * Math.sin(angle + Math.PI / 7));
    context.lineTo(toX, toY);
    context.stroke();
    context.restore();
  }

  handleZoom() {
    this.canvas.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      const scaleFactor = 1.1;
      const zoom = event.deltaY > 0 ? 1 / scaleFactor : scaleFactor;

      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const offsetX = (mouseX - this.cameraOffset.x) / this.zoomLevel;
      const offsetY = (mouseY - this.cameraOffset.y) / this.zoomLevel;

      this.zoomLevel *= zoom;
      this.zoomLevel = Math.min(Math.max(this.zoomLevel, this.MIN_ZOOM), this.MAX_ZOOM);

      this.cameraOffset.x = mouseX - offsetX * this.zoomLevel;
      this.cameraOffset.y = mouseY - offsetY * this.zoomLevel;

      this.draw();
    });
  }

  handleDrag() {
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      this.isDragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      if (this.isDragging) {
        const deltaX = (event.clientX - this.lastX) / this.zoomLevel;
        const deltaY = (event.clientY - this.lastY) / this.zoomLevel;
        this.lastX = event.clientX;
        this.lastY = event.clientY;
        this.cameraOffset.x += deltaX;
        this.cameraOffset.y += deltaY;
        this.draw();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
  }
}
