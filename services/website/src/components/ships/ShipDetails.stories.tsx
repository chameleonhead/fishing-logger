import { Meta, StoryObj } from "@storybook/react";

import { ShipDetails } from "./ShipDetails";

const meta = {
  title: "components/ships/ShipDetails",
  component: ShipDetails,
} as Meta<typeof ShipDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: "1",
      name: "おおもと丸",
      iot_enabled: true,
    },
  },
};

export const WithState: Story = {
  args: {
    data: {
      id: "1",
      name: "おおもと丸",
      iot_enabled: false,
    },
    state: {
      signalk: {
        navigation: {
          courseOverGroundTrue: null,
          datetime: "2023-08-10T05:18:20.000Z",
          magneticVariationAgeOfService: 1691644700,
          gnss: {
            satellites: 3,
            antennaAltitude: -11.2,
            differentialAge: 0,
            satellitesInView: {
              satellites: [
                {
                  elevation: 0.1396263401914272,
                  azimuth: 0.5759586532896371,
                  id: 74,
                  SNR: 0,
                },
                {
                  elevation: 0.8552113336724915,
                  azimuth: 5.201081172130663,
                  id: 66,
                  SNR: 0,
                },
                {
                  elevation: 0.15707963271535558,
                  azimuth: 5.8293997029920845,
                  id: 82,
                  SNR: 0,
                },
                {
                  elevation: 0.12217304766749879,
                  azimuth: 2.3911010757781903,
                  id: 76,
                  SNR: 0,
                },
                {
                  elevation: 0.349065850478568,
                  azimuth: 1.448623279486057,
                  id: 75,
                  SNR: 0,
                },
                {
                  elevation: 0.7679448710528495,
                  azimuth: 0.43633231309820997,
                  id: 65,
                  SNR: 0,
                },
                {
                  elevation: 0.9250245037682051,
                  azimuth: 3.508111797309608,
                  id: 88,
                  SNR: 0,
                },
                {
                  elevation: 0.15707963271535558,
                  azimuth: 2.967059729067828,
                  id: 87,
                  SNR: 0,
                },
                {
                  elevation: 0.8901179187203483,
                  azimuth: 5.358160804846018,
                  id: 81,
                  SNR: 0,
                },
                {
                  elevation: 0.15707963271535558,
                  azimuth: 4.502949471173527,
                  id: 67,
                  SNR: 0,
                },
                {
                  elevation: null,
                  azimuth: null,
                  id: 0,
                  SNR: null,
                },
              ],
              count: 10,
            },
            differentialReference: 0,
            methodQuality: "GNSS Fix",
            horizontalDilution: 2.9,
          },
          speedOverGround: null,
          courseOverGroundMagnetic: null,
          position: {
            latitude: null,
            longitude: null,
          },
          magneticVariation: null,
        },
      },
    },
  },
};
