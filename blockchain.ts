export interface ItemData {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl?: string;
  userId: string;
  userContact: string;
}

export class Block {
  constructor(
    public timestamp: number,
    public data: ItemData,
    public previousHash: string = '',
    public hash: string = ''
  ) {
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return btoa(JSON.stringify(this.data) + this.previousHash + this.timestamp.toString());
  }
}

export class BlockchainService {
  private chain: Block[] = [];

  constructor() {
    // Load chain from localStorage or initialize with genesis block
    const storedChain = localStorage.getItem('blockchain');
    if (storedChain) {
      this.chain = JSON.parse(storedChain).map((block: any) => 
        new Block(block.timestamp, block.data, block.previousHash, block.hash)
      );
    } else {
      this.chain = [new Block(Date.now(), { id: '0', type: 'found', title: 'Genesis Block', description: '', location: '', date: '', userId: '', userContact: '' })];
      this.saveChain();
    }
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: ItemData): void {
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(Date.now(), data, previousBlock.hash);
    this.chain.push(newBlock);
    this.saveChain();
  }

  getChain(): Block[] {
    return this.chain;
  }

  removeBlock(id: string): void {
    this.chain = this.chain.filter(block => block.data.id !== id);
    this.saveChain();
  }

  updateBlock(id: string, newData: ItemData): void {
    const index = this.chain.findIndex(block => block.data.id !== id);
    if (index !== -1) {
      this.chain[index].data = newData;
      this.chain[index].hash = this.chain[index].calculateHash();
      this.saveChain();
    }
  }

  private saveChain(): void {
    localStorage.setItem('blockchain', JSON.stringify(this.chain));
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}