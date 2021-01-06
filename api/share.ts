import { NowRequest, NowResponse } from '@vercel/node';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { savePatch } from '../lib/api';
import type { Rack } from '../lib/types';

readdirSync(join(__dirname, '../')).forEach((file) => {
  console.log(file);
});

const library = readFileSync(join(__dirname, '../public/modules.json'), 'utf8');

export default async (request: NowRequest, response: NowResponse) => {
  if (request.method !== 'POST') {
    return response.status(400).send('');
  }

  const { title, rack } = request.body as { title: string; rack: Rack };

  try {
    const url = await savePatch(title, rack, JSON.parse(library));
    response.status(200).send(JSON.stringify({ url }));
  } catch (error) {
    console.error(error);
    response.status(422).send(JSON.stringify({ error: error.message }));
  }
};
