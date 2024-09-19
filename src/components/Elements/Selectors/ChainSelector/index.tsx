import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import Image from 'next/image';

import { useCoretimeApi, useRegionXApi, useRelayApi } from '@/contexts/apis';
import { ChainType, NetworkType } from '@/models';

import styles from './index.module.scss';

interface ChainSelectorProps {
  chain: ChainType;
  setChain: (_: ChainType) => void;
}

import { enableRegionX } from '@/utils/functions';

import {
  Kusama,
  KusamaCoretime,
  Polkadot,
  PolkadotCoretime,
  RegionX,
  Rococo,
  RococoCoretime,
  Westend,
  WestendCoretime,
} from '@/assets/networks';
import { useNetwork } from '@/contexts/network';

const coretimeIcons = {
  [NetworkType.POLKADOT]: PolkadotCoretime,
  [NetworkType.KUSAMA]: KusamaCoretime,
  [NetworkType.ROCOCO]: RococoCoretime,
  [NetworkType.WESTEND]: WestendCoretime,
  [NetworkType.NONE]: '',
};

const relayIcons = {
  [NetworkType.POLKADOT]: Polkadot,
  [NetworkType.KUSAMA]: Kusama,
  [NetworkType.ROCOCO]: Rococo,
  [NetworkType.WESTEND]: Westend,
  [NetworkType.NONE]: '',
};

export const ChainSelector = ({ chain, setChain }: ChainSelectorProps) => {
  const { network } = useNetwork();
  const {
    state: { name: coretimeChain, isApiReady: isCoretimeReady },
  } = useCoretimeApi();
  const {
    state: { name: relayChain, isApiReady: isRelayReady },
  } = useRelayApi();

  const {
    state: { name: regionXChain, isApiReady: isRegionXReady },
  } = useRegionXApi();

  const menuItems = [
    {
      icon: relayIcons[network],
      label: relayChain,
      value: ChainType.RELAY,
      loading: !isRelayReady,
    },
    {
      icon: coretimeIcons[network],
      label: coretimeChain,
      value: ChainType.CORETIME,
      loading: !isCoretimeReady,
    },
    ...(enableRegionX(network)
      ? [
          {
            icon: RegionX,
            label: regionXChain,
            value: ChainType.REGIONX,
            loading: isRegionXReady,
          },
        ]
      : []),
  ];
  return (
    <FormControl fullWidth>
      <InputLabel id='origin-selector-label'>Chain</InputLabel>
      <Select
        labelId='origin-selector-label'
        id='origin-selector'
        value={chain}
        label='Origin'
        sx={{ borderRadius: '1rem' }}
        onChange={(e) => setChain(e.target.value as ChainType)}
      >
        {menuItems.map(({ icon, label, value, loading }, index) => (
          <MenuItem value={value} key={index}>
            <Box className={styles.chainItem}>
              <Image src={icon} alt='icon' className={styles.icon} />
              {loading ? (
                <CircularProgress size='1.5rem' />
              ) : (
                <Typography className={styles.label}>{label}</Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
