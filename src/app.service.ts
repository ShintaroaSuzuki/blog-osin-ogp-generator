import { Injectable } from '@nestjs/common';
import { createCanvas, registerFont, loadImage } from 'canvas';
import * as path from 'path';

@Injectable()
export class AppService {
  async generate(title: string): Promise<Buffer> {
    try {
      const splitByMeasureWidth = (
        str: string,
        maxWidth: number,
        context: CanvasRenderingContext2D,
      ): string[] => {
        const lines: string[] = [];
        let line: string = '';
        str.split('').forEach((char) => {
          line += char;
          if (context.measureText(line).width > maxWidth) {
            lines.push(line.slice(0, -1));
            line = line.slice(-1);
          }
        });
        lines.push(line);
        return lines;
      };

      const generateOgp = async (title: string) => {
        const CANVAS_WIDTH = 1200;
        const CANVAS_HEIGHT = 630;
        const BACKGROUND_IMAGE_PATH = path.join(
          __dirname,
          '..',
          'images',
          'background.png',
        );
        const FONT_COLOR = '#000000';
        const FONT_SIZE = 48;
        const LINE_MARGIN_SIZE = 20;
        const MARGIN_X = 240;
        const MARGIN_TOP = 320;
        const FONT_FAMILY = 'Noto Sans JP Medium';
        const FONT_PATH = path.join(
          __dirname,
          '..',
          'fonts',
          'NotoSansJP-Medium.otf',
        );

        registerFont(FONT_PATH, { family: FONT_FAMILY });

        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const ctx = canvas.getContext('2d');

        const background = await loadImage(BACKGROUND_IMAGE_PATH);
        ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
        ctx.fillStyle = FONT_COLOR;
        const titleLines: string[] = splitByMeasureWidth(
          title,
          CANVAS_WIDTH - MARGIN_X,
          ctx,
        );
        let lineY: number = MARGIN_TOP;
        // let lineY: number =
        //   (CANVAS_HEIGHT + FONT_SIZE) / 2 -
        //   ((FONT_SIZE + LINE_MARGIN_SIZE) / 2) * (titleLines.length - 1);
        titleLines.forEach((line: string) => {
          const textWidth: number = ctx.measureText(line).width;
          ctx.fillText(line, (CANVAS_WIDTH - textWidth) / 2, lineY);
          lineY += FONT_SIZE + LINE_MARGIN_SIZE;
        });

        return canvas.toBuffer('image/png');
      };

      return await generateOgp(title);
    } catch (e) {
      console.log(e);
    }
  }
}
