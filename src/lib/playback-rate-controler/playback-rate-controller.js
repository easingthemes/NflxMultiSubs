import icon from '../icons/ff.svg';

const config = {
  isActive: 'isActive',
  wrapper: 'nflxmultisubs-playback-rate',
  text: 'nflxmultisubs-playback-rate__text',
  playerContainer: '.nf-player-container',
  time: 300
};

export class PlaybackRateController {
  constructor() {
    this.eventAdded = false;
    this.timer = undefined;
    this.$iconWrapper = null;
    this.$iconText = null;
    this.$playerContainer = null;
    this.$video = null;
    this._keyUpHandler = this._keyUpHandler.bind(this);
  }

  activate() {
    this.setRefs();
    this.injectIcon();

    if (this.eventAdded) return;

    window.addEventListener('keyup', this._keyUpHandler);
    this.eventAdded = true;
  }

  deactivate() {
    if (!this.eventAdded) return;

    window.removeEventListener('keyup', this._keyUpHandler);
    this.eventAdded = false;
  }

  setRefs() {
    this.$playerContainer = document.querySelector(config.playerContainer);
    if (this.$playerContainer) {
      this.$video = this.$playerContainer.querySelector('video');
    }
  }

  updateRefs() {
    if (!this.$playerContainer || !this.$video) {
      this.setRefs();
      this.injectIcon();
    }
  }

  _keyUpHandler(evt) {
    if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
    if ((evt.keyCode !== 219 /* [ */) && (evt.keyCode !== 221 /* ] */)) return;

    this.updateRefs();

    if (!this.$playerContainer || !this.$video) return;

    let playbackRate = this.$video.playbackRate;
    if (evt.keyCode === 219) playbackRate -= 0.1; // key [ pressed
    else if (evt.keyCode == 221) playbackRate += 0.1; // ] pressed

    this.updatePlaybackRate(playbackRate);
    this.updateIcon(playbackRate);
    this.animateIcon();
  }

  updatePlaybackRate(update) {
    if (!this.$video) return;
    const playbackRate = Math.max(Math.min(update, 3.0), 0.1);
    this.$video.playbackRate = playbackRate;
  }

  updateIcon(playbackRate) {
    if (!this.$iconText) return;

    this.$iconText.innerText = `${playbackRate.toFixed(1)}x`;
  }

  createIcon() {
    const div = document.createElement('div');
    div.classList.add(config.wrapper);

    const spanIcon = document.createElement('span');
    spanIcon.innerHTML = icon;

    this.$iconText = document.createElement('span');
    this.$iconText.classList.add(config.text);

    div.appendChild(spanIcon);
    div.appendChild(this.$iconText);

    return div;
  }

  injectIcon() {
    this.$iconWrapper = this.createIcon();

    if (!this.$playerContainer || !this.$iconWrapper) return;

    this.$playerContainer.appendChild(this.$iconWrapper);
  }

  animateIcon() {
    if (!this.$iconWrapper) return;

    if (this.timer) clearTimeout(this.timer);
    this.$iconWrapper.classList.add(config.isActive);
    this.timer = setTimeout(() => {
      this.$iconWrapper.classList.remove(config.isActive);
      this.timer = null;
    }, config.time);
  }
}
