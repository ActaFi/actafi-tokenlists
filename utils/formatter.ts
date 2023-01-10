import tokenList from '../tokenlist.json';
import { writeFileSync, readdirSync} from 'fs';

type Token = {
  name: string;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  links?: Link[],
};

type Link = {
  href: string;
  icon: string;
}

function checkDuplicates() {
  // check duplicates in json by parameter name
  // if duplicates found, throw error
  const tokens: Token[] = tokenList.tokens
  const newList: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!newList[token.address.toLowerCase()]) {
      newList[token.address.toLowerCase()] = {
        name: token.name,
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        chainId: token.chainId,
        logoURI: token.logoURI
      };
    } else {
      console.log('duplicate', token.name, token.chainId, token.address)
    }
  }
  let data = JSON.stringify({...tokenList, tokens: Object.values(newList)});
  writeFileSync('out/tokenListCleaned.json', data);
}

function checkImage() {
  const logos = readdirSync('logos')
  const tokens: Token[] = tokenList.tokens
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const match = logos.filter((logo) => logo === token.address);
    if (match.length !== 1) {
      console.log('missing image', token.name, token.chainId, token.address)
    }
  }
}

async function checkImageLoads() {
  const tokens: Token[] = tokenList.tokens
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const res = await fetch(token.logoURI, { method: 'HEAD' })
    if (!res.ok) {
      console.log('image does not load', token.name, token.chainId, token.address);
    }
  }
}

function main() {
  console.log('checking duplicates...')
  checkDuplicates()
  console.log('checking images...')
  checkImage()
  console.log('checking images load...')
  checkImageLoads()
}
main()
