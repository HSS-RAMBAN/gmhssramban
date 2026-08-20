export default {
  async fetch(request: Request, env: any) {
    return env.ASSETS.fetch(request);
  },
};
