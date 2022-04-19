pragma circom 2.0.0;

template BitCounter(N) {
    signal input ins[N];
    signal output out;

    assert(N > 2 && N % 2 == 0);

    signal intermediates[N - 1];

    for (var i = 0; i < N / 2; i++) {
        intermediates[i + N / 2 - 1] <== ins[2 * i] + ins[2 * i + 1];
    }

    for (var i = N / 2 - 2; i >= 0; i--) {
        intermediates[i] <== intermediates[2 * i + 1] + intermediates[2 * i + 2];
    }

    out <== intermediates[0];
}