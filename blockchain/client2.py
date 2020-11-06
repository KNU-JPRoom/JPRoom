import socket
import threading
from threading import Thread,Lock
import sys
import pickle  # socket.send에서 list 보내기 위한 module
from blockchain import *
import json
import hashlib
import time

bqLock = threading.Lock();
rqLock = threading.Lock();
idLock = threading.Lock();
rcvLock = threading.Lock();

HOST = 'localhost'
PORT = 7777
#q = queue.Queue()

blockChain = []
recordQueue = []
blockQueue = []
userList = ['katarina', 'garen', 'lux', 'shen', 'xin xiao', 'anni', 'fiz', 'rammus'
'anivia', 'rize', 'samira', 'yasuo']
def rcvMsg(sock):
    id = None
    while True:
        try:
            data = sock.recv(1024)
            print(pickle.loads(data))
            if not data:
                break

            MSG = pickle.loads(data)

#            print(MSG)
            if MSG['Block'] == False:
                if MSG['ID'] == True:            #가입인지 아닌지 구분.
                    idLock.acquire()
                    print('in block[false]-id[true] ' + MSG['context'])
                    id = input()
                    sock.send(id.encode())
                    idLock.release()
                else:
                    idLock.acquire()
                    print('in block[false]-id[false]' + MSG['context'])
                    idLock.release()
            else:
                if MSG['completable'] == True:
                    bqLock.acquire()
                    blockQueue.append(MSG['data'])
                    bqLock.release()
                elif MSG['initial'] == True:
                    print('initial true')
                    rcvLock.acquire()
                    bc = None
                    sock.send("OK".encode())
                    bc = sock.recv(100000)
                    jbc = pickle.loads(bc)
#                    print(jbc)
#                    print('in cMsg: ' + jbc)
                    for i in jbc:
                        blockChain.append(jbc[i])
                    rcvLock.release()
                    blockChain.reverse()
                    print(blockChain)
                else:
                    rqLock.acquire()
                    recordQueue.append(MSG['data'])
                    rqLock.release()
        except:
            pass

def sendMsg(sock):

    sMsg = sock.recv(1024)
    sMsg = pickle.loads(sMsg)
#    print(sMsg)
    if sMsg == 'OK':
        MSG = "WEBSERVER"+ userList[0] +" send 10$ to " + userList[1]
        print(MSG)
        sock.send(MSG.encode())
    else:
        pass

def runChat():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:     #socket 생성
        sock.connect((HOST,PORT))

        t1 = Thread(target=rcvMsg, args=(sock,))
        #pre_chain = q.get(chain)
        #chain = pre_chain
        t1.daemon = True   #Thread 클래스에서 daemon 속성은 서브쓰레드가 데몬 쓰레드인지 아닌지를 지정하는 것인데, 데몬 쓰레드란 백그라운드에서 실행되는 쓰레드로 메인 쓰레드가 종료되면 즉시 종료되는 쓰레드이다. 반면 데몬 쓰레드가 아니면 해당 서브쓰레드는 메인 쓰레드가 종료할 지라도 자신의 작업이 끝날 때까지 계속 실행된다.
        t1.start()

#        m = sock.recv(1024)
#        m = pickle.loads(m)
#        print(m)
#        if m['ID'] == False and m['Block'] == False:
#            print(m['context'])
#        rcvLock.acquire()

#        cMsg = sock.recv(1024)
#        cMsg = pickle.loads(cMsg)

#        if cMsg['initial'] == True:  #아마 dic형태로 변환한 블록체인이 들어오는 부분임.
#            bc = sock.recv(100000)
#            jbc = pickle.loads(bc)
#            print('in cMsg: ' + jbc)
#            for i in jbc:
#                blockChain.append(jbc[i])
#            blockChain.reverse()
#        else:
#            pass

#        rcvLock.release()
#        if d['ID'] == True:
#            print(d['context'])
#            msg = input()
#            sock.send(msg.encode())
#            pass
#        elif d['ID'] == False:
#        t2 = Thread(target=sendMsg, args=(sock,))
#        t2.daemon = True
#        t2.start()

        while True:
            bqLock.acquire()
#            print('bqLock acquire')
            block = None
            if len(blockQueue)!=0:
                block = blockQueue.get()        #queue에서 아무것도 없으면 무엇을 반환하나?
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

                if len(blockChain)!=0 and blockChain[-1]['data']['index'] >= record['data']['index']:   #record에 있는 블록보다 체인에 존재하는 블록이 최신이면 버림.
                    continue
                else:           #더 최신정보이면 mining
                    proof = 0
                    while True:
                        guess = hashlib.sha256(record['data']).hexdigest()
                        if guess[:record['data']['difficulty']] == "0"*record['data']['difficulty']:
                            break
                        else:
                            proof = proof + 1
                    record['data']['proof'] = proof

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
