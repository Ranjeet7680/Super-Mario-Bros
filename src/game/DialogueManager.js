/**
 * Cinematic Dialogue Engine
 * Supports Bollywood-style dramatic framing, speaker emotion portraits, and bilingual typing.
 * Adheres to Section 6 & 7 of the RRR Architecture Bible.
 */

import { Localization } from './Localization.js';

export class DialogueManager {
  constructor(audio) {
    this.audio = audio;
    this.isActive = false;
    this.dialogueQueue = [];
    this.currentIndex = 0;
    this.displayedText = '';
    this.targetText = '';
    this.charIndex = 0;
    this.typeTimer = 0;
    this.typeSpeed = 0.025; // seconds per char
    this.currentEntry = null;
    this.onCompleteCallback = null;
  }

  setTextSpeed(mode) {
    if (mode === 'instant') this.typeSpeed = 0;
    else if (mode === 'fast') this.typeSpeed = 0.012;
    else this.typeSpeed = 0.025;
  }

  startDialogue(entries, onComplete = null) {
    this.dialogueQueue = entries;
    this.currentIndex = 0;
    this.onCompleteCallback = onComplete;
    this.isActive = true;
    if (this.audio) this.audio.setMusicDucking(true);
    this.showEntry(0);
  }

  showEntry(index) {
    if (index >= this.dialogueQueue.length) {
      this.close();
      return;
    }

    this.currentIndex = index;
    this.currentEntry = this.dialogueQueue[index];
    this.targetText = this.currentEntry.text;
    this.displayedText = '';
    this.charIndex = 0;
    this.typeTimer = 0;

    if (this.typeSpeed === 0) {
      this.displayedText = this.targetText;
      this.charIndex = this.targetText.length;
    }
  }

  next() {
    if (!this.isActive) return;

    // If currently typing, jump to full text
    if (this.charIndex < this.targetText.length) {
      this.displayedText = this.targetText;
      this.charIndex = this.targetText.length;
      return;
    }

    // Otherwise advance to next entry
    this.showEntry(this.currentIndex + 1);
  }

  close() {
    this.isActive = false;
    this.currentEntry = null;
    if (this.audio) this.audio.setMusicDucking(false);
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
      this.onCompleteCallback = null;
    }
  }

  update(dt) {
    if (!this.isActive || !this.currentEntry) return;

    if (this.charIndex < this.targetText.length) {
      this.typeTimer += dt;
      if (this.typeTimer >= this.typeSpeed) {
        this.typeTimer = 0;
        this.displayedText += this.targetText[this.charIndex];
        this.charIndex++;
        if (this.charIndex % 3 === 0 && this.audio) {
          this.audio.playDialogueBlip();
        }
      }
    }
  }

  draw(ctx, width, height) {
    if (!this.isActive || !this.currentEntry) return;

    ctx.save();

    // Cinematic Black Letterbox Bars (Bollywood style framing)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, 40);
    ctx.fillRect(0, height - 160, width, 160);

    // Dialogue Panel
    const boxY = height - 150;
    const boxH = 140;

    ctx.fillStyle = 'rgba(28, 20, 16, 0.95)';
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(30, boxY, width - 60, boxH, 12);
    ctx.fill();
    ctx.stroke();

    // Speaker Portrait Frame
    const portX = 55;
    const portY = boxY + 18;
    const portSize = 104;

    ctx.fillStyle = '#3E2723';
    ctx.fillRect(portX, portY, portSize, portSize);
    ctx.strokeStyle = '#FFB74D';
    ctx.lineWidth = 2;
    ctx.strokeRect(portX, portY, portSize, portSize);

    // Draw Speaker Portrait according to role & emotion
    this.drawPortrait(ctx, portX + portSize / 2, portY + portSize / 2, this.currentEntry.role, this.currentEntry.emotion);

    // Speaker Name Banner
    ctx.fillStyle = '#FF6F00';
    ctx.fillRect(180, boxY + 14, 220, 26);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(this.currentEntry.speaker, 192, boxY + 32);

    // Dialogue Text
    ctx.fillStyle = '#FFF8E1';
    ctx.font = '16px sans-serif';
    this.drawWrappedText(ctx, this.displayedText, 185, boxY + 68, width - 260, 24);

    // Advance Prompt Indicator
    ctx.fillStyle = '#FFB74D';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Localization.get('skipText'), width - 50, boxY + boxH - 14);

    ctx.restore();
  }

  drawPortrait(ctx, cx, cy, role, emotion) {
    ctx.save();
    ctx.translate(cx, cy);

    if (role === 'mentor') {
      // Guru Kripal portrait
      ctx.fillStyle = '#8D6E63';
      ctx.beginPath();
      ctx.arc(0, -6, 26, 0, Math.PI * 2);
      ctx.fill();

      // White/Silver hair & beard
      ctx.fillStyle = '#ECEFF1';
      ctx.beginPath();
      ctx.arc(0, -12, 28, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-18, -4);
      ctx.lineTo(0, 32);
      ctx.lineTo(18, -4);
      ctx.closePath();
      ctx.fill();

      // Calm / gentle eyes
      ctx.fillStyle = '#212121';
      ctx.fillRect(-12, -8, 6, 3);
      ctx.fillRect(6, -8, 6, 3);

      // Tilak forehead marking
      ctx.fillStyle = '#D84315';
      ctx.fillRect(-2, -26, 4, 10);
    } else {
      // Kabir (Protagonist) portrait
      ctx.fillStyle = '#A16238';
      ctx.beginPath();
      ctx.arc(0, -4, 28, 0, Math.PI * 2);
      ctx.fill();

      // Black hair & saffron headband
      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.arc(-2, -10, 29, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#FF6F00';
      ctx.fillRect(-26, -14, 52, 8);

      // Scarf collar
      ctx.fillStyle = '#E65100';
      ctx.fillRect(-24, 20, 48, 16);

      // Eyes (Determined)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-16, -6, 10, 6);
      ctx.fillRect(6, -6, 10, 6);
      ctx.fillStyle = '#0D47A1';
      ctx.fillRect(-12, -5, 5, 5);
      ctx.fillRect(10, -5, 5, 5);
    }

    ctx.restore();
  }

  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currY);
  }
}
