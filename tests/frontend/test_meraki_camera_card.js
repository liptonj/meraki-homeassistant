
import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import 'lovelace-player';

import MerakiCameraCard from '../../www/meraki_ha/src/cards/meraki-camera-card';

describe('MerakiCameraCard', () => {
  let element;
  let hass;

  beforeEach(async () => {
    hass = {
      states: {
        'camera.meraki_camera': {
          entity_id: 'camera.meraki_camera',
          attributes: {
            friendly_name: 'Meraki Camera',
            meraki_dashboard_url: 'https://dashboard.meraki.com',
          },
        },
      },
      callWS: sinon.stub(),
    };

    element = await fixture(html`
      <meraki-camera-card .hass=${hass}></meraki-camera-card>
    `);
    element.config = { entity_id: 'camera.meraki_camera' };
  });

  it('renders the card header', () => {
    const header = element.shadowRoot.querySelector('.card-header span');
    expect(header).to.exist;
    expect(header.textContent).to.equal('Meraki Camera');
  });

  it('fetches and displays the live stream', async () => {
    hass.callWS.withArgs({ type: 'camera/stream', entity_id: 'camera.linked_camera' }).resolves({ url: 'live_stream.mp4' });
    element.config = { entity_id: 'camera.meraki_camera', linked_camera_id: 'camera.linked_camera' };
    await element.updateComplete;

    const video = element.shadowRoot.querySelector('video');
    expect(video).to.exist;
    expect(video.src).to.equal('live_stream.mp4');
  });

  it('falls back to RTSP stream', async () => {
    hass.callWS.withArgs({ type: 'camera/stream', entity_id: 'camera.linked_camera' }).rejects();
    hass.callWS.withArgs({ type: 'meraki_ha/get_rtsp_url', entity_id: 'camera.meraki_camera' }).resolves({ rtsp_url: 'rtsp://stream' });
    element.config = { entity_id: 'camera.meraki_camera', linked_camera_id: 'camera.linked_camera' };
    await element.updateComplete;

    const img = element.shadowRoot.querySelector('img');
    expect(img).to.exist;
    expect(img.src).to.equal('rtsp://stream');
  });

  it('falls back to snapshot', async () => {
    hass.callWS.withArgs({ type: 'camera/stream', entity_id: 'camera.linked_camera' }).rejects();
    hass.callWS.withArgs({ type: 'meraki_ha/get_rtsp_url', entity_id: 'camera.meraki_camera' }).rejects();
    hass.callWS.withArgs({ type: 'meraki_ha/get_camera_snapshot', entity_id: 'camera.meraki_camera' }).resolves({ url: 'snapshot.jpg' });
    element.config = { entity_id: 'camera.meraki_camera', linked_camera_id: 'camera.linked_camera' };
    await element.updateComplete;

    const img = element.shadowRoot.querySelector('img');
    expect(img).to.exist;
    expect(img.src).to.equal('snapshot.jpg');
  });

  it('shows an error message on failure', async () => {
    hass.callWS.rejects();
    element.config = { entity_id: 'camera.meraki_camera', linked_camera_id: 'camera.linked_camera' };
    await element.updateComplete;

    const error = element.shadowRoot.querySelector('div.error');
    expect(error).to.exist;
    expect(error.textContent).to.contain('Failed to fetch any camera stream or snapshot.');
  });
});
