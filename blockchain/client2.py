import socket
from threading import Thread,Lock
import sys
import pickle  # socket.send에서 list 보내기 위한 module
from blockchain import *

HOST = 'localhost'
PORT = 7777
#q = queue.Queue()

blockchain = Blockchain()
chain = blockchain.chain

def rcvMsg(sock):
    while True:
        try:
            data = sock.recv(1024)
            print(data.decode())
            if not data:
                break
        except:
            pass

def runChat():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:     #socket 생성
        sock.connect((HOST,PORT))
        t = Thread(target=rcvMsg, args=(sock,))
        #pre_chain = q.get(chain)
        #chain = pre_chain
        t.daemon = True   #Thread 클래스에서 daemon 속성은 서브쓰레드가 데몬 쓰레드인지 아닌지를 지정하는 것인데, 데몬 쓰레드란 백그라운드에서 실행되는 쓰레드로 메인 쓰레드가 종료되면 즉시 종료되는 쓰레드이다. 반면 데몬 쓰레드가 아니면 해당 서브쓰레드는 메인 쓰레드가 종료할 지라도 자신의 작업이 끝날 때까지 계속 실행된다.
        t.start()
        while True:
            msg = input()
            if msg == '/quit':
                sock.send(msg.encode())
                break
            if msg == 'transaction':
                sender = input("보내는 사람")
                receiver   = input("받는 사람")
                amount = input("보내는 양")
                blockchain.new_transaction(sender,receiver,amount)
                transactions = blockchain.current_transaction
                data = pickle.dumps(transactions)
                sock.send(data)
                continue
            if msg == 'chain':
                print(blockchain)       #blockchain객체의 주소를 출력함.
                # queue 로 동기화(;)
                #pre_chain = blockchain.chain
                #q.put(pre_chain)
                #chain = q.get()
                #------
                #q.put(chain)
                #chain = blockchain.chain
                data = pickle.dumps(chain)
                sock.send(data)
                continue
            if msg == 'mine':
                last_block = blockchain.last_block
                last_proof = last_block['proof']    #block 에 저장되어있는 json내부의 proof property를 저장. proof property에는 magic number(최초 3개의 해쉬값 000을 만족시키기 위해 산출된 숫자)
                previous_hash = blockchain.hash(last_block)
                proof = blockchain.pow(last_proof, previous_hash)
                block = blockchain.new_block(proof, previous_hash)
                #queue 에 block data 추가
                #q.put(block)
                response = {
                'message' : 'new block found',
                'index' : block['index'],
                'transactions' : block['transactions'],
                'proof' : block['proof'],
                'previous_hash' : block['previous_hash'],
                'hash' : blockchain.hash(block)
                }
                blockchain.block_hash.append(blockchain.hash(block))
                data = pickle.dumps(response)
                sock.send(data)
                continue
            if(msg == 'ready'):
                data = 'ready'
                data = pickle.dumps(data)
                sock.send(data)
                continue

            sock.send(msg.encode())

runChat()
