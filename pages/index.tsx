import dayjs from 'dayjs';
import { ethers } from 'ethers';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import abi from './abi/Freelancer.json';

declare let window: any;
interface ITask {
  detail: string;
  creator: string;
  freelancer: string;
  status: number;
  amount: number;
  updatedAt: number;
}

type ConditionalButtonProps = {
  loading: boolean;
  customerAddress: string;
  task: ITask;
  idx: number;
  onClickBtn: (status: number, idx: number) => void;
};

const ConditionalButton = ({
  loading,
  customerAddress,
  task,
  idx,
  onClickBtn,
}: ConditionalButtonProps) => {
  const [isClicked, setClick] = useState(false);

  const handleClick = () => {
    setClick(true);
    onClickBtn(task.status, idx);
  };

  useEffect(() => {
    setClick(false);
  }, []);

  if (task.status !== null) {
    if (loading && isClicked) {
      return (
        <button
          type="button"
          className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
          disabled
        >
          <svg
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      );
    }
    switch (task.status) {
      case 0:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled={customerAddress === task.creator.toLocaleLowerCase()}
            onClick={handleClick}
          >
            Apply
          </button>
        );
      case 1:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled={customerAddress !== task.creator.toLocaleLowerCase()}
            onClick={handleClick}
          >
            Start
          </button>
        );
      case 2:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled={customerAddress !== task.freelancer.toLocaleLowerCase()}
            onClick={handleClick}
          >
            Complete
          </button>
        );
      case 3:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled={customerAddress !== task.creator.toLocaleLowerCase()}
            onClick={handleClick}
          >
            Pay
          </button>
        );
      case 4:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled
            onClick={handleClick}
          >
            Finished
          </button>
        );
      default:
        return (
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-red-500 rounded-lg btn-connect text-slate-100 hover:bg-red-600 disabled:bg-red-400"
            disabled
            onClick={handleClick}
          >
            Finished
          </button>
        );
    }
  } else {
    console.log('no task status');
    return <div />;
  }
};

const Home: NextPage = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [inputValue, setInputValue] = useState({
    detail: '',
    amount: '',
  });
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const taskStatus = [
    'CREATED',
    'APPLIED',
    'INPROGRESS',
    'COMPLETED',
    'PAID',
    'CLAIMED',
  ];

  const contractAddress =
    process.env.NEXT_PUBLIC_FREELANCER_CONTRACT_ADDRESS || '';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log('Account Connected: ', account);
      } else {
        setError('Please install a MetaMask wallet to use our bank.');
        console.log('No Metamask detected');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (event: any) => {
    setInputValue((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const getAllTasks = async () => {
    try {
      if (window.ethereum) {
        // write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const freelancerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const tasks = await freelancerContract.getAllTasks();
        console.log('tasks', tasks);
        setAllTasks(tasks);
      } else {
        console.log('Ethereum object not found, install Metamask.');
        setError('Please install a MetaMask wallet to use our bank.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createTaskHandler = async (event: any) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        // write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const freelancerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const txn = await freelancerContract.createTask(inputValue.detail, {
          value: ethers.utils.parseEther(inputValue.amount),
        });
        console.log('Creating a task...');
        await txn.wait();
        console.log('Created a task...done', txn.hash);
        await getAllTasks();
      } else {
        console.log('Ethereum object not found, install Metamask.');
        setError('Please install a MetaMask wallet to use our bank.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdateStatus = async (status: number, idx: number) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const freelancerContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        if (status === 0) {
          const txn = await freelancerContract.applyTask(idx);
          console.log('Applying a task...');
          setBtnLoading(true);
          await txn.wait();
          setBtnLoading(false);
          console.log('Applied a task...done', txn.hash);
        } else if (status === 1) {
          const txn = await freelancerContract.startTask(idx);
          console.log('Starting a task...');
          setBtnLoading(true);
          await txn.wait();
          setBtnLoading(false);
          console.log('Started a task...done', txn.hash);
        } else if (status === 2) {
          const txn = await freelancerContract.completeTask(idx);
          console.log('Completing a task...');
          setBtnLoading(true);
          await txn.wait();
          setBtnLoading(false);
          console.log('Completed a task...done', txn.hash);
        } else if (status === 3) {
          const txn = await freelancerContract.payTask(idx);
          console.log('Paying a task...');
          setBtnLoading(true);
          await txn.wait();
          setBtnLoading(false);
          console.log('Paid a task...done', txn.hash);
        }
        await getAllTasks();
      } else {
        console.log('Ethereum object not found, install Metamask.');
        setError('Please install a MetaMask wallet to use our bank.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllTasks();
  }, [isWalletConnected]);

  return (
    <main className="w-full max-w-5xl mx-auto overflow-hidden text-lg bg-gray-900 border-2 shadow-lg main-container sm:mt-14 sm:rounded-xl border-slate-800 text-slate-300">
      <h2 className="p-2 text-4xl font-bold text-center bg-gray-900 border-b-2 headlinle sm:text-left sm:py-5 border-slate-800 sm:px-10 text-violet-400">
        <span className="text-transparent headline-gradient bg-clip-text bg-gradient-to-tr from-indigo-500 to-purple-900">
          Freelancer Contract Project
        </span>{' '}
        💰
      </h2>
      <section className="flex flex-col px-10 pt-5 pb-10 border-b-2 border-slate-800 task-input">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-7 mb-9">
          <form className="flex flex-col rounded-lg form-style">
            <div className="flex flex-row gap-4">
              <input
                type="text"
                className="w-5/6 px-6 py-3 text-gray-100 placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg outline-none input-style focus:placeholder-transparent focus-within:ring-indigo-500"
                onChange={handleInputChange}
                name="detail"
                placeholder="Fixing a bathroom"
                value={inputValue.detail}
              />
              <input
                type="text"
                className="w-1/6 px-6 py-3 text-gray-100 placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg outline-none input-style focus:placeholder-transparent focus-within:ring-indigo-500"
                onChange={handleInputChange}
                name="amount"
                placeholder="0.0000 ETH"
                value={inputValue.amount}
              />
            </div>
            <button
              type="button"
              className="px-4 py-3 mt-3 text-sm font-bold tracking-wider text-gray-100 uppercase transition-colors duration-200 transform bg-indigo-800 rounded-lg btn-purple hover:bg-indigo-700"
              onClick={createTaskHandler}
            >
              Create a Task
            </button>
          </form>
        </div>

        <div className="flex flex-row items-center justify-between mt-5">
          <button
            type="button"
            className="px-5 py-3 mr-3 font-bold bg-indigo-500 rounded-lg btn-connect text-slate-100"
            onClick={checkIfWalletIsConnected}
          >
            {isWalletConnected ? 'Wallet Connected 🔒' : 'Connect Wallet 🔑'}
          </button>
          {isWalletConnected && (
            <p>
              <span className="font-bold">Your Wallet Address: </span>
              {customerAddress}
            </p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-4 px-10 pt-5 pb-10 task-table">
        {allTasks &&
          allTasks.map((task, idx) => (
            <div
              className="flex flex-row items-center p-4 text-white bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-800"
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
            >
              <div className="w-5/6">
                <p className="text-2xl">{task.detail}</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-base">
                    {ethers.utils.formatEther(task.amount)} ETH
                  </p>
                  <p className="text-base">{taskStatus[task.status]}</p>
                  <p className="text-base">
                    {dayjs.unix(+task.updatedAt).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Creator:{' '}
                    {ethers.utils.isAddress(task.creator)
                      ? `${task.creator.substring(
                          0,
                          10
                        )}...${task.creator.slice(-4)}`
                      : '-'}
                  </p>
                  <p className="text-sm">
                    Freelancer:{' '}
                    {ethers.utils.isAddress(task.freelancer) &&
                    ethers.constants.AddressZero.toString() !== task.freelancer
                      ? `${task.freelancer.substring(
                          0,
                          10
                        )}...${task.freelancer.slice(-4)}`
                      : '-'}
                  </p>
                </div>
              </div>
              <div className="flex justify-end w-1/6">
                <ConditionalButton
                  loading={btnLoading}
                  customerAddress={customerAddress ?? ''}
                  task={task}
                  idx={idx}
                  onClickBtn={onUpdateStatus}
                />
              </div>
            </div>
          ))}
      </section>
    </main>
  );
};

export default Home;
