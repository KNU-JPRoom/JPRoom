import socket
import threading
from threading import Thread,Lock
import sys
import pickle  # socket.send에서 list 보내기 위한 module
from blockchain import *
import json

bqLock = threading.Lock();
rqLock = threading.Lock();
idLock = threading.Lock();

HOST = 'localhost'
PORT = 7777
state = '0'
#q = queue.Queue()

blockChain = []
recordQueue = []
blockQueue = []


def rcvMsg(sock):
    id = None
    while True:
        try:
            data = sock.recv(1024)
            MSG = json.loads(data.decode())
            print(MSG)
            if MSG['ID'] == True:
                idLock.acquire()
                print(MSG['context'])
                id = input()
                sock.send(id.encode())
                idLock.release()
            else:
                if MSG['completable'] == True:
                    bqLock.acquire()
                    blockQueue.append(MSG['data'])
                    bqLock.release()
                else:
                    rqLock.acquire()
                    recordQueue.append(MSG['data'])
                    rqLock.release()
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

        m = sock.recv(100000)       #처음접속한 노드에게 블록의 최신데이터를 전송시키는데, 블록을 받는 부분.
        d = json.loads(m.decode())  #아마 dic형태로 변환한 블록체인이 들어오는 부분임.
#        if d['ID'] == True:
#            print(d['context'])
#            msg = input()
#            sock.send(msg.encode())
#            pass
#        elif d['ID'] == False:
        print(d)
        sorted(d.items)
        for i in d:
            blockChain.append(d[i])
        print(blockChain)
        while True:
            bqLock.acquire()
#            print('bqLock acquire')
            block = None
            if len(blockQueue)!=0:
                block = blockQueue.get()
            bqLock.release()

            if block != None:
                blockChain.append(block)
            else:
                record = None
                rqLock.acquire()
                if len(recordQueue)!=0:
                    record = recordQueue.get()
                rqLock.release()
                if record == None:
                    continue

                if len(blockChain)!=0 and blockChain[-1]['data']['index'] >= record['data']['index']:
                    continue
                else:
                    proof = 0
                    while True:
                        record['data']['proof'] = proof
                        guess = sha256(record['data'])
                        if guess[:record['data']['difficulty']] == "0"*record['data']['difficulty']:
                            break
                        else:
                            proof = proof + 1
                    sock.send({'index' : record['data']['index'], 'proof': proof})
                    print('send success')




# #            msg = input()
# #            if msg == '/quit':
#                 sock.send(msg.encode())
#                 break
#             if msg == 'chain':
#                 print(blockchain)       #blockchain객체의 주소를 출력함.
#                 # queue 로 동기화(;)
#                 #pre_chain = blockchain.chain
#                 #q.put(pre_chain)
#                 #chain = q.get()
#                 #------
#                 #q.put(chain)
#                 #chain = blockchain.chain
#                 data = pickle.dumps(chain)
#                 sock.send(data)
#                 continue
#             if msg == 'mine':                       #추후 입력을 받지않아도 일정 수의 contarct data가 쌓이면 mining하게끔 해주어야함.
#                 last_block = blockchain.last_block
#                 last_proof = last_block['proof']    #block 에 저장되어있는 json내부의 proof property를 저장. proof property에는 magic number(최초 3개의 해쉬값 000을 만족시키기 위해 산출된 숫자)
#                 previous_hash = blockchain.hash(last_block)
#                 proof = blockchain.pow(last_proof, previous_hash)
#                 block = blockchain.new_block(proof, previous_hash)
#                 #queue 에 block data 추가
#                 #q.put(block)
#                 response = {
#                 'message' : 'new block found',
#                 'index' : block['index'],
#                 'transactions' : block['transactions'],
#                 'proof' : block['proof'],
#                 'previous_hash' : block['previous_hash'],
#                 'hash' : blockchain.hash(block)
#                 }
#                 blockchain.block_hash.append(blockchain.hash(block))
#                 data = pickle.dumps(response)
#                 sock.send(data)
#                 continue
#             if(msg == 'ready'):
#                 data = 'ready'
#                 data = pickle.dumps(data)
#                 sock.send(data)
#
#                 continue
# #            if(state == '1'):        #준비가 된 상태이면
# #                date = pickle.dumps(state)
# #                sock.send(data)
# #                continue
#
#             sock.send(msg.encode())

runChat()
