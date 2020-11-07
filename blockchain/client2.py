import socket
import threading
from threading import Thread,Lock
import sys
import pickle  # socket.send에서 list 보내기 위한 module
from blockchain import *
import json
import hashlib
import time

bcLock = threading.Lock();
bqLock = threading.Lock();
rqLock = threading.Lock();

HOST = '127.0.0.1'
PORT = 7777
#q = queue.Queue()

blockChain = []
recordQueue = []
blockQueue = []
def rcvMsg(sock):
    global blockQueue
    global recordQueue

    while True:
        try:
            data = sock.recv(1000)
            MSG = pickle.loads(data)
            print(MSG)
            if MSG['MSGTYPE'] == 'INIT_BLOCK':
                bcLock.acquire()
                for i in MSG['data']:
                    blockChain.append(MSG['data'][i])
                blockChain.reverse()
                bcLock.release()
                sock.send(pickle.dumps({'MSGTYPE':'REQ_OK','ID':'fad'}));
            elif MSG['MSGTYPE'] == 'BLOCK':
                    bqLock.acquire()
                    blockQueue.append(MSG['data'])
                    bqLock.release()
            elif MSG['MSGTYPE'] == 'RECORD':
                    rqLock.acquire()
                    recordQueue.append(MSG['data'])
                    rqLock.release()
        except Exception as ex:
            print('에러 발생', ex)


def runChat():
    global blockQueue
    global recordQueue

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:     #socket 생성
        sock.connect((HOST,PORT))

        id = None
        rMsg = sock.recv(1024)
        rMsg = rMsg.decode()

        print(rMsg,end='')

        id = input()
        sock.send(id.encode())
        block2 = {
                'hash': 0,
                'updatable':True,
                'data':
                {
                    'index':0,
                    'timestamp': 0,
                    'transaction': 0,
                    'proof': 0,
                    'difficulty': 0,
                    'previous_hash': 0
                }
             }
        MSG = {'MSGTYPE':'record','ID':'Master','data':{'index': 1, 'timestamp' : 0, 'transaction': 'makeTrans', 'proof': 0, 'difficulty' : 2,  'previous_hash': 'DUHFHI14GUNEN6fuWDAHFH)'}}

        t1 = Thread(target=rcvMsg, args=(sock,))
        #pre_chain = q.get(chain)
        #chain = pre_chain
        t1.daemon = True   #Thread 클래스에서 daemon 속성은 서브쓰레드가 데몬 쓰레드인지 아닌지를 지정하는 것인데, 데몬 쓰레드란 백그라운드에서 실행되는 쓰레드로 메인 쓰레드가 종료되면 즉시 종료되는 쓰레드이다. 반면 데몬 쓰레드가 아니면 해당 서브쓰레드는 메인 쓰레드가 종료할 지라도 자신의 작업이 끝날 때까지 계속 실행된다.
        t1.start()

        while True:

            bqLock.acquire()
#            print('bqLock acquire')
            block = None
            if len(blockQueue)!=0:
                block = blockQueue[0]        #queue에서 아무것도 없으면 무엇을 반환하나?
                blockQueue = blockQueue[1:]
            bqLock.release()

            if block != None:
                bcLock.acquire()
                blockChain.append(block)
                bcLock.release()
                continue
            else:
                record = None
                rqLock.acquire()
                if len(recordQueue)!=0:
                    record = recordQueue[0]
                    recordQueue = recordQueue[1:]
                    print(record)
                rqLock.release()
                if record == None:
                    continue

                bcLock.acquire()
                if len(blockChain)!=0 and blockChain[-1]['data']['index'] >= record['index']:   #record에 있는 블록보다 체인에 존재하는 블록이 최신이면 버림.
                    continue
                else:           #더 최신정보이면 mining
                    proof = 0
                    while True:
                        record['proof'] = proof
                        blockDstring = json.dumps(record).encode()
                        guess = hashlib.sha256(blockDstring).hexdigest()
                        if guess[:record['difficulty']] == "0"*record['difficulty']:
                            print(guess)
                            break
                        else:
                            proof = proof + 1
                    print(record['proof'])
                    sock.send(pickle.dumps({'MSGTYPE':'REQ_MAKEBLOCK','ID': 'piora', 'index' : record['index'], 'proof': proof}))
                bcLock.release()

runChat()
