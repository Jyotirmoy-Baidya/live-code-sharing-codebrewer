import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import { closeBrackets } from '@codemirror/autocomplete';
import { TiTick } from 'react-icons/ti';
import { GiCrossMark } from 'react-icons/gi';

function CodingPlayground({ code, setCode, language, input, setInput, output, metrics, getLanguageExtension, customInput, setCustomInput, testCasesResult }) {


  const javaKeywords = [
    // Java Keywords
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
    'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
    'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized',
    'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while',
    'true', 'false',

    // Java Built-in Classes
    'String', 'StringBuilder', 'StringBuffer', 'Object', 'Class', 'System', 'Runtime', 'Thread',
    'Throwable', 'Exception', 'RuntimeException', 'Error', 'Integer', 'Long', 'Short', 'Byte',
    'Float', 'Double', 'Character', 'Boolean', 'Math', 'Enum', 'Void', 'Process', 'ThreadGroup',
    'Package', 'SecurityManager', 'StackTraceElement', 'Throwable', 'Exception', 'RuntimeException',

    // Java.util Classes
    'ArrayList', 'LinkedList', 'HashMap', 'HashSet', 'TreeMap', 'TreeSet', 'Hashtable', 'Vector',
    'Stack', 'Queue', 'Deque', 'PriorityQueue', 'Arrays', 'Collections', 'Calendar', 'Date',
    'TimeZone', 'UUID', 'Optional', 'Scanner', 'Random',

    // Java.io Classes
    'File', 'InputStream', 'OutputStream', 'FileInputStream', 'FileOutputStream', 'BufferedReader',
    'BufferedWriter', 'PrintWriter', 'ObjectInputStream', 'ObjectOutputStream', 'Serializable',
    'Reader', 'Writer', 'FileReader', 'FileWriter', 'PrintStream', 'FileDescriptor',

    // Java.nio Classes
    'ByteBuffer', 'CharBuffer', 'IntBuffer', 'ShortBuffer', 'LongBuffer', 'MappedByteBuffer',
    'FileChannel', 'Path', 'Paths', 'Files',

    // Java.net Classes
    'URL', 'URI', 'InetAddress', 'Socket', 'ServerSocket', 'HttpURLConnection',

    // Java.sql Classes
    'DriverManager', 'Connection', 'Statement', 'PreparedStatement', 'ResultSet', 'SQLException',
    'Date', 'Time', 'Timestamp',

    // Java.time Classes
    'LocalDate', 'LocalTime', 'LocalDateTime', 'ZonedDateTime', 'Duration', 'Period', 'Instant',
    'ZoneId', 'OffsetDateTime', 'Year', 'Month', 'DayOfWeek',

    // Java Built-in Interfaces
    'Runnable', 'Comparable', 'CharSequence', 'Cloneable', 'AutoCloseable', 'List', 'Set', 'Map',
    'Queue', 'Deque', 'Iterator', 'Collection', 'Comparator', 'Enumeration', 'Closeable',
    'DataInput', 'DataOutput', 'Flushable', 'Readable', 'Serializable', 'ReadableByteChannel',
    'WritableByteChannel', 'Key', 'PrivateKey', 'PublicKey', 'Principal', 'Temporal',
    'TemporalAccessor', 'TemporalAdjuster', 'TemporalAmount', 'Chronology', 'ChronoLocalDate',
    'ChronoLocalDateTime',

    // Notable Annotations
    'Override', 'Deprecated', 'SuppressWarnings', 'FunctionalInterface', 'SafeVarargs', 'Retention',
    'Target', 'Inherited', 'Documented',

    //
    'out', 'print', 'println'
  ];



  const customCompletions = completeFromList(
    javaKeywords.map(javaKeywords => ({ label: javaKeywords }))
  );


  return (
    <div className="w-1/2 h-[36rem] p-2  flex flex-col gap-2 bg-primary-black text-white">
      {/* Code Editor */}
      <div className='w-full'>
        <CodeMirror
          value={code}
          // height='100%'
          extensions={[
            getLanguageExtension(language),
            autocompletion({ override: [customCompletions] }), // Add autocompletion
            closeBrackets()   // Optional: Automatically close brackets and quotes
          ]}
          theme={oneDark}
          onChange={(value) => setCode(value)}
          className="text h-full min-h-96 bg-gray-800 design-scrollbar"
        />
      </div>

      {/* Input, Output*/}
      {/* Input Section */}
      <label htmlFor="Option3" className="flex cursor-pointer items-start gap-2">
        <div className="flex items-center">
          &#8203;
          <input type="checkbox" className="size-4 rounded border-gray-300" id="Option3" onClick={() => setCustomInput(!customInput)} />
        </div>
        <div>
          <strong className="font-medium text-sm text-gray-200"> Custom Input </strong>
        </div>
      </label>
      {
        customInput &&
        <>
          <div className='min-h-48 flex flex-col'>
            <h2 className="text-lg mb-1 font-medium">Input :</h2>
            <textarea
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-gray-800 outline-none p-2 rounded w-full mb-4 resize-none h-[100%] overflow-scroll design-scrollbar"
            />
          </div>
        </>
      }
      {
        testCasesResult.length > 0 &&
        <div className='grid grid-col-3'>
          {
            testCasesResult.map((ele, i) => (
              <div className='py-3 px-4 text-gray-300' key={i}>Testcase {i + 1} {ele.status == 'passed' ? <TiTick /> : <GiCrossMark />}</div>
            ))
          }
        </div>
      }

      {/* Output Section */}
      <div className='min-h-48 flex flex-col'>
        <h2 className="text-lg mb-1 font-medium">Output:</h2>
        <div className="bg-gray-800 outline-none p-2 rounded w-full mb-4 h-full overflow-scroll design-scrollbar"><pre>{output}</pre></div>
      </div>







      {/* Metrics Section */}
      <div className='flex flex-col'>
        <h2 className="text-lg mb-1 font-medium">Metrics</h2>
        <p className='text-sm text-gray-300'>Execution Time : &nbsp; {metrics.time}</p>
        <p className='text-sm text-gray-300'>Memory Usage : &nbsp; {metrics.memory}</p>
      </div>
    </div>
  );
}

export default CodingPlayground;