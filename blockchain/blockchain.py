import hashlib
import json
from time import time
import urllib.parse
import requests


class Blockchain():
	def __init__(self):
		self.chain = []
		self.block_hash = []						#
		self.current_transaction = []
		self.new_block(previous_hash=1,proof=100)	#매개변수 순서는 상관없다. 초기값만 잘 지정해준다면

	def new_block(self,proof,previous_hash=None):	#block생성후 chain에 append
		block = {
			'index': len(self.chain)+1,
			'timestamp': time(),
			'transactions': self.current_transaction,
			'proof': proof,
			'previous_hash': previous_hash or self.hash(self.chain[-1])
		}
		self.current_transaction = []

		self.chain.append(block)
		return block

	def new_transaction(self,From,To,Amount):     #curnet_transaction array에 append
		self.current_transaction.append(
			{
				'From' : From,
				'To' : To,
				'Amount' : Amount
			}
		)
		return self.last_block['index'] + 1

	def valid_chain(self,chain):             # (register node 후 )
		last_block = chain[0]
		current_index = 1

		while current_index < len(chain):
			block = chain[current_index]
			print('{}'.format(last_block))
			print('{}'.format(block))
			print("\n---------\n")
			if block['previous_hash'] != self.hash(last_block):
				return False
			last_block = block
			current_index += 1
		return True

	@staticmethod
	def hash(block):
		block_string = json.dumps(block, sort_keys=True).encode()
		return hashlib.sha256(block_string).hexdigest()

	@property
	def last_block(self):
		return self.chain[-1]

	def pow(self, last_proof, previous_hash):
		proof = 0
		while self.valid_proof(last_proof, proof, previous_hash) is False:
			proof += 1
		return proof

	#정적메소드
	@staticmethod
	def valid_proof(last_proof, proof, previous_hash):
		guess = (str(last_proof + proof)+previous_hash).encode()
		guess_hash = hashlib.sha256(guess).hexdigest()
		return guess_hash[:3] == "000" # nonce
